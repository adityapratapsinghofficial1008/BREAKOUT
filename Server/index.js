import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { db } from './db.js';
import { getYoutubeTitle, generateCourseTopics, evaluateStudentAnswer } from './ai.js';
import { sendVerificationEmail } from './mailer.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;
const JWT_SECRET = process.env.JWT_SECRET || 'breakout_jwt_secret_key_secure_2026';

app.use(cors());
app.use(express.json());

// ─── Auth Middleware ──────────────────────────────────────────────────────────
export function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ success: false, error: 'Invalid or expired token' });
    }
    req.user = decoded;
    next();
  });
}

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ─── Auth Routes ──────────────────────────────────────────────────────────────

// 1. POST /api/auth/register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, name, clientUrl } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ success: false, error: 'Email, password, and name are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, error: 'Password must be at least 6 characters long' });
    }

    const existingUser = db.getUserByEmail(email);
    if (existingUser) {
      if (!existingUser.isVerified) {
        // Re-generate verification token and re-send email
        const newVerificationToken = crypto.randomBytes(32).toString('hex');
        db.updateUserVerificationToken(existingUser.id, newVerificationToken);
        
        await sendVerificationEmail({
          toEmail: existingUser.email,
          name: existingUser.name,
          verificationToken: newVerificationToken,
          clientUrl
        });

        return res.status(400).json({
          success: false,
          error: 'An unverified account already exists with this email. A new verification link has been sent to your email.'
        });
      }
      return res.status(400).json({ success: false, error: 'An account with this email already exists. Please log in.' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const userId = crypto.randomUUID();

    const user = db.createUser({
      id: userId,
      email,
      passwordHash,
      name,
      verificationToken
    });

    // Send verification email
    try {
      await sendVerificationEmail({
        toEmail: user.email,
        name: user.name,
        verificationToken,
        clientUrl
      });
    } catch (mailErr) {
      console.error('Failed to send verification email:', mailErr);
    }

    res.status(201).json({
      success: true,
      message: 'Registration successful! A verification link has been sent to your registered email.',
      email: user.email
    });
  } catch (error) {
    console.error('Error in /api/auth/register:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// 2. GET /api/auth/verify-email?token=xyz
app.get('/api/auth/verify-email', (req, res) => {
  try {
    const { token } = req.query;
    if (!token) {
      return res.status(400).json({ success: false, error: 'Verification token is required' });
    }

    const user = db.getUserByVerificationToken(token);
    if (!user) {
      return res.status(400).json({ success: false, error: 'Invalid or expired verification token' });
    }

    db.verifyUser(user.id);

    // Issue JWT so user is immediately logged in upon verification
    const authToken = jwt.sign(
      { id: user.id, email: user.email, name: user.name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      message: 'Email verified successfully! You can now access your dashboard.',
      token: authToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    });
  } catch (error) {
    console.error('Error in /api/auth/verify-email:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// 3. POST /api/auth/resend-verification
app.post('/api/auth/resend-verification', async (req, res) => {
  try {
    const { email, clientUrl } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, error: 'Email is required' });
    }

    const user = db.getUserByEmail(email);
    if (!user) {
      return res.status(404).json({ success: false, error: 'No account found with this email' });
    }

    if (user.isVerified) {
      return res.status(400).json({ success: false, error: 'This email is already verified. Please log in.' });
    }

    const newVerificationToken = crypto.randomBytes(32).toString('hex');
    db.updateUserVerificationToken(user.id, newVerificationToken);

    await sendVerificationEmail({
      toEmail: user.email,
      name: user.name,
      verificationToken: newVerificationToken,
      clientUrl
    });

    res.json({
      success: true,
      message: 'A fresh verification link has been sent to your email.'
    });
  } catch (error) {
    console.error('Error in /api/auth/resend-verification:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// 4. POST /api/auth/login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Email and password are required' });
    }

    const user = db.getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ success: false, error: 'Invalid email or password' });
    }

    if (!user.isVerified) {
      return res.status(403).json({
        success: false,
        isUnverified: true,
        error: 'Please verify your email address before logging in. Check your inbox for the verification link.',
        email: user.email
      });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    });
  } catch (error) {
    console.error('Error in /api/auth/login:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// 5. GET /api/auth/me
app.get('/api/auth/me', authenticateToken, (req, res) => {
  const user = db.getUserById(req.user.id);
  if (!user) {
    return res.status(404).json({ success: false, error: 'User not found' });
  }

  res.json({
    success: true,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      isVerified: user.isVerified
    }
  });
});

// ─── 1. GET /api/progress/:videoId ────────────────────────────────────────────
// Retrieve topics and milestones for a workspace course.
// If the course doesn't exist yet, generates it from the YouTube video title.
app.get('/api/progress/:videoId', async (req, res) => {
  const { videoId } = req.params;
  try {
    let course = db.getCourse(videoId);

    if (!course) {
      console.log(`Course not found for videoId: ${videoId}. Auto-generating...`);
      const title = await getYoutubeTitle(videoId);
      const topics = await generateCourseTopics(videoId, title);
      course = db.saveCourse(videoId, { title, topics });
    }

    res.json({
      success: true,
      data: {
        videoId: course.videoId,
        title: course.title,
        topics: course.topics
      }
    });
  } catch (error) {
    console.error("Error in GET /api/progress/:videoId:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ─── 2. POST /api/ai/generate ─────────────────────────────────────────────────
// Triggered when a user enters a YouTube link on the dashboard.
// Generates a new course workspace and initializes the user's session.
app.post('/api/ai/generate', async (req, res) => {
  const { sessionId, userId } = req.body;

  if (!sessionId) {
    return res.status(400).json({ success: false, error: "Missing sessionId (videoId)" });
  }

  const activeUserId = userId || 'anonymous';

  try {
    console.log(`[generate] Generating course for videoId: ${sessionId}, user: ${activeUserId}`);
    const title = await getYoutubeTitle(sessionId);
    console.log(`[generate] Video title resolved: "${title}"`);
    const topics = await generateCourseTopics(sessionId, title);
    console.log(`[generate] Generated ${topics.length} topics.`);

    // Persist course
    db.saveCourse(sessionId, { title, topics });

    // Initialize user session for this course
    db.saveUserSession(activeUserId, sessionId, {
      title,
      duration: '0m',
      totalWatchMinutes: 0,
      capstoneScore: 0,
      completedMilestones: []
    });

    res.json({ success: true, title, topicsCount: topics.length });
  } catch (error) {
    console.error("Error in POST /api/ai/generate:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ─── 3. PATCH /api/ai/:videoId/topics/:topicName/answer ───────────────────────
// Submit and grade a student's text or voice (Feynman) answer.
app.patch('/api/ai/:videoId/topics/:topicName/answer', async (req, res) => {
  const { videoId, topicName } = req.params;
  const { studentAnswer, questionType, userId } = req.body;

  if (!studentAnswer || typeof studentAnswer !== 'string' || !studentAnswer.trim()) {
    return res.status(400).json({ success: false, error: "Missing or empty studentAnswer" });
  }

  const decodedTopicName = decodeURIComponent(topicName);

  try {
    const course = db.getCourse(videoId);
    if (!course) {
      return res.status(404).json({ success: false, error: "Course not found. Please generate the course first." });
    }

    // Find the topic & the appropriate question text
    const topic = course.topics.find(t => t.topicName === decodedTopicName);
    if (!topic) {
      console.warn(`Topic "${decodedTopicName}" not found in course ${videoId}. Available: ${course.topics.map(t => t.topicName).join(', ')}`);
      return res.status(404).json({ success: false, error: `Topic "${decodedTopicName}" not found in course` });
    }

    const questionText = questionType === 'feynman'
      ? (topic.feynmanQuestionText || topic.description)
      : (topic.textQuestionText || topic.description);

    console.log(`[answer] Evaluating ${questionType} answer for video: ${videoId}, topic: "${decodedTopicName}"`);
    const grading = await evaluateStudentAnswer(questionText, studentAnswer.trim(), questionType);
    console.log(`[answer] Score: ${grading.score}`);

    // Determine which users to update (prefer the requesting user, then scan all)
    const targetUserIds = userId ? [userId] : db.getUsersForVideo(videoId);

    // Save quiz attempt and update progress for all target users
    targetUserIds.forEach(uid => {
      db.saveQuizAttempt(uid, videoId, decodedTopicName, questionType, grading.score);

      // Only update milestone progress on passing score (>= 50)
      if (grading.score >= 50) {
        const userSessions = db.getUserSessions(uid);
        const session = userSessions.find(s => s.videoId === videoId);

        if (session) {
          let completed = session.completedMilestones || [];
          const topicIndex = course.topics.findIndex(t => t.topicName === decodedTopicName);

          if (topicIndex > -1 && !completed.includes(topicIndex)) {
            completed = [...completed, topicIndex];
          }

          const totalTopics = course.topics.length || 1;
          const capstoneScore = Math.floor((completed.length / totalTopics) * 100);
          // 15 minutes watch time per milestone passed
          const totalWatchMinutes = completed.length * 15;

          db.saveUserSession(uid, videoId, {
            completedMilestones: completed,
            capstoneScore,
            totalWatchMinutes
          });
        } else {
          // Create a session entry for this user if it doesn't exist yet
          db.saveUserSession(uid, videoId, {
            title: course.title || 'Video Tutorial',
            duration: '0m',
            totalWatchMinutes: 15,
            capstoneScore: Math.floor((1 / (course.topics.length || 1)) * 100),
            completedMilestones: [course.topics.findIndex(t => t.topicName === decodedTopicName)].filter(i => i > -1)
          });
        }
      }
    });

    res.json({
      success: true,
      score: grading.score,
      feedback: grading.feedback
    });
  } catch (error) {
    console.error("Error grading answer:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ─── 3.5 POST /api/progress/:videoId/complete-milestone ─────────────────────────
// Persist milestone completion directly when user answers or skips a checkpoint
app.post('/api/progress/:videoId/complete-milestone', (req, res) => {
  const { videoId } = req.params;
  const { milestoneIndex, userId } = req.body;

  try {
    const course = db.getCourse(videoId);
    const targetUserIds = Array.from(new Set([
      userId || 'anonymous',
      'anonymous',
      ...db.getUsersForVideo(videoId)
    ]));

    targetUserIds.forEach(uid => {
      const userSessions = db.getUserSessions(uid);
      const session = userSessions.find(s => s.videoId === videoId);

      let completed = session?.completedMilestones || [];
      if (typeof milestoneIndex === 'number' && milestoneIndex > -1 && !completed.includes(milestoneIndex)) {
        completed = [...completed, milestoneIndex];
      }

      const totalTopics = course?.topics?.length || 4;
      const capstoneScore = Math.floor((completed.length / totalTopics) * 100);
      const totalWatchMinutes = completed.length * 15;

      db.saveUserSession(uid, videoId, {
        title: course?.title || session?.title || 'Video Tutorial',
        completedMilestones: completed,
        capstoneScore,
        totalWatchMinutes
      });
    });

    res.json({ success: true });
  } catch (err) {
    console.error("Error in POST /api/progress/:videoId/complete-milestone:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ─── 4. GET /api/dashboard/user/:userId ───────────────────────────────────────
// Retrieve aggregated user stats and metrics for the dashboard page.
app.get('/api/dashboard/user/:userId', (req, res) => {
  const { userId } = req.params;

  try {
    let sessions = [...db.getUserSessions(userId)];
    let quizzes = [...db.getUserQuizzes(userId)];

    // If logged-in user, merge anonymous sessions/quizzes so demo progress is preserved
    if (userId !== 'anonymous') {
      const anonSessions = db.getUserSessions('anonymous');
      const anonQuizzes = db.getUserQuizzes('anonymous');

      anonSessions.forEach(anonS => {
        const userSIdx = sessions.findIndex(s => s.videoId === anonS.videoId);
        if (userSIdx === -1) {
          sessions.push(anonS);
        } else {
          const userCompleted = sessions[userSIdx].completedMilestones || [];
          const anonCompleted = anonS.completedMilestones || [];
          const mergedCompleted = Array.from(new Set([...userCompleted, ...anonCompleted]));
          
          const course = db.getCourse(anonS.videoId);
          const totalTopics = course?.topics?.length || 4;
          const capstoneScore = Math.floor((mergedCompleted.length / totalTopics) * 100);

          sessions[userSIdx] = {
            ...sessions[userSIdx],
            completedMilestones: mergedCompleted,
            capstoneScore: Math.max(sessions[userSIdx].capstoneScore || 0, capstoneScore),
            totalWatchMinutes: Math.max(sessions[userSIdx].totalWatchMinutes || 0, mergedCompleted.length * 15)
          };
        }
      });

      anonQuizzes.forEach(aq => {
        if (!quizzes.some(q => q.videoId === aq.videoId && q.topicName === aq.topicName && q.score === aq.score)) {
          quizzes.push(aq);
        }
      });
    }

    // Recalculate capstone score for each session dynamically
    sessions = sessions.map(s => {
      const course = db.getCourse(s.videoId);
      const totalTopics = course?.topics?.length || 4;
      const completedCount = (s.completedMilestones || []).length;
      const capstoneScore = completedCount > 0 
        ? Math.floor((completedCount / totalTopics) * 100) 
        : (s.capstoneScore || 0);

      return {
        ...s,
        capstoneScore
      };
    });

    // Aggregate metrics
    let totalWatchMinutes = 0;
    let totalTopicsCount = 0;
    let capstoneScoreSum = 0;

    sessions.forEach(s => {
      totalWatchMinutes += s.totalWatchMinutes || 0;
      totalTopicsCount += (s.completedMilestones || []).length;
      capstoneScoreSum += s.capstoneScore || 0;
    });

    let totalScoreSum = 0;
    quizzes.forEach(q => { totalScoreSum += q.score; });

    const quizCount = quizzes.length;
    const averageScore = quizCount > 0 ? Math.floor(totalScoreSum / quizCount) : 0;
    const avgOverallCompetency = sessions.length > 0 ? Math.floor(capstoneScoreSum / sessions.length) : 0;

    // Build chart data from quiz attempts (last 7, chronological)
    const chartData = quizzes
      .map(q => ({ date: q.date, score: q.score, topicName: q.topicName }))
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(-7);

    res.json({
      success: true,
      data: {
        totalWatchMinutes,
        averageScore,
        totalTopicsCount,
        avgOverallCompetency,
        recentSessions: sessions,
        chartData
      }
    });
  } catch (error) {
    console.error("Error in GET /api/dashboard/user/:userId:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ─── Start Server ─────────────────────────────────────────────────────────────
app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n🚀 Break-out Backend Server running at http://localhost:${PORT}`);
  console.log(`   MISTRAL_API_KEY: ${process.env.MISTRAL_API_KEY ? '✅ configured' : '❌ MISSING'}`);
  console.log(`   GROQ_API_KEY:    ${process.env.GROQ_API_KEY ? '✅ configured' : '❌ MISSING'}\n`);
});
