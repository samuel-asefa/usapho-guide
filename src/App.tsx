import React, { useState, useEffect, useRef } from 'react';

interface Option {
  text: string;
}

interface Problem {
  id: string;
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard';
  question: string;
  options: Option[];
  correctOptionIndex: number;
  solution: string;
}

interface Resource {
  title: string;
  url: string;
  description: string;
}

interface Formula {
    name: string;
    equation: string;
    description:string;
}

interface TopicNote {
    topic: string;
    content: string; // Detailed notes with LaTeX
}

interface Tier {
    name: string;
    minXp: number;
}

const tiers: Tier[] = [
    { name: 'Bronze', minXp: 0 },
    { name: 'Silver', minXp: 100 },
    { name: 'Gold', minXp: 250 },
    { name: 'Platinum', minXp: 500 },
    { name: 'Diamond', minXp: 750 },
    { name: 'Elite', minXp: 1250 },
    { name: 'Champion', minXp: 2500 },
    { name: 'Unreal', minXp: 5000 },
];

const problemDatabase: Problem[] = [
  {
    id: 'kin_01',
    topic: 'Kinematics',
    difficulty: 'easy',
    question: 'A particle starts from rest and accelerates uniformly at $2 \\, \\text{m/s}^2$. What is its velocity after traveling a distance of $9 \\, \\text{m}$?',
    options: [{ text: '$3 \\, \\text{m/s}$' }, { text: '$6 \\, \\text{m/s}$' }, { text: '$9 \\, \\text{m/s}$' }, { text: '$12 \\, \\text{m/s}$' }, { text: '$18 \\, \\text{m/s}$' }],
    correctOptionIndex: 1,
    solution: 'We need a kinematic equation that relates final velocity ($v$), initial velocity ($v_0$), acceleration ($a$), and displacement ($\\Delta x$) without time. The appropriate equation is $v^2 = v_0^2 + 2a\\Delta x$.<br/>Given values: $v_0 = 0 \\, \\text{m/s}$ (starts from rest), $a = 2 \\, \\text{m/s}^2$, and $\\Delta x = 9 \\, \\text{m}$.<br/>Substitute the values: $v^2 = 0^2 + 2(2)(9) = 36 \\, \\text{m}^2/\\text{s}^2$.<br/>Taking the square root gives the final velocity: $v = \\sqrt{36} = 6 \\, \\text{m/s}$.'
  },
  {
    id: 'dyn_01',
    topic: 'Dynamics',
    difficulty: 'medium',
    question: 'A block of mass $m = 5 \\, \\text{kg}$ is pulled along a frictionless horizontal surface by a rope that makes an angle of $\\theta = 30^\\circ$ with the horizontal. The tension in the rope is $T = 20 \\, \\text{N}$. What is the acceleration of the block?',
    options: [{ text: '$2\\sqrt{3} \\, \\text{m/s}^2$' }, { text: '$4 \\, \\text{m/s}^2$' }, { text: '$2 \\, \\text{m/s}^2$' }, { text: '$10\\sqrt{3} \\, \\text{m/s}^2$' }],
    correctOptionIndex: 0,
    solution: "According to Newton's Second Law, the net force on an object equals its mass times its acceleration, $\\sum \\vec{F} = m\\vec{a}$. We only need to consider the horizontal forces, as the surface is frictionless. The horizontal component of the tension is $T_x = T \\cos(\\theta)$.<br/>Applying the law: $\\sum F_x = T \\cos(\\theta) = ma$.<br/>Solving for acceleration $a$: $a = \\frac{T \\cos(\\theta)}{m}$.<br/>Substitute the given values: $a = \\frac{20 \\, \\text{N} \\cdot \\cos(30^\\circ)}{5 \\, \\text{kg}}$.<br/>Since $\\cos(30^\\circ) = \\frac{\\sqrt{3}}{2}$, we have: $a = \\frac{20 (\\sqrt{3}/2)}{5} = \\frac{10\\sqrt{3}}{5} = 2\\sqrt{3} \\, \\text{m/s}^2$."
  },
  {
    id: 'energy_01',
    topic: 'Energy & Work',
    difficulty: 'easy',
    question: 'A $2 \\, \\text{kg}$ block slides down a frictionless incline of height $5 \\, \\text{m}$. If the block starts from rest, what is its speed at the bottom of the incline? (Use $g = 9.8 \\, \\text{m/s}^2$)',
    options: [{ text: '$\\approx 7.0 \\, \\text{m/s}$' }, { text: '$\\approx 9.9 \\, \\text{m/s}$' }, { text: '$\\approx 14.0 \\, \\text{m/s}$' }],
    correctOptionIndex: 1,
    solution: 'We use the principle of conservation of mechanical energy, since there is no friction. The initial potential energy ($PE_i$) at the top is converted into kinetic energy ($KE_f$) at the bottom.<br/>$PE_i + KE_i = PE_f + KE_f$<br/>$mgh + 0 = 0 + \\frac{1}{2}mv^2$<br/>The mass $m$ cancels from both sides: $gh = \\frac{1}{2}v^2$.<br/>Solving for $v$: $v = \\sqrt{2gh}$.<br/>$v = \\sqrt{2(9.8 \\, \\text{m/s}^2)(5 \\, \\text{m})} = \\sqrt{98} \\approx 9.9 \\, \\text{m/s}$.'
  },
  {
    id: 'rot_01',
    topic: 'Rotational Motion',
    difficulty: 'hard',
    question: 'A solid sphere with mass $M$ and radius $R$ rolls without slipping down an incline with an angle of inclination $\\theta$. What is its linear acceleration $a$? The moment of inertia of a solid sphere is $I = \\frac{2}{5}MR^2$.',
    options: [{ text: '$g \\sin\\theta$' }, { text: '$\\frac{2}{3} g \\sin\\theta$' }, { text: '$\\frac{5}{7} g \\sin\\theta$' }, { text: '$\\frac{2}{5} g \\sin\\theta$' }],
    correctOptionIndex: 2,
    solution: 'We apply Newton\'s Second Law for both linear and rotational motion.<br>1. Linear motion down the incline: $\\sum F_x = Mg\\sin\\theta - f_s = Ma$, where $f_s$ is the force of static friction.<br>2. Rotational motion: $\\sum \\tau = f_s R = I\\alpha$.<br>For rolling without slipping, we have the constraint $a = \\alpha R$, so $\\alpha = a/R$.<br>Substitute $I$ and $\\alpha$ into the torque equation: $f_s R = (\\frac{2}{5}MR^2)(\\frac{a}{R}) \\implies f_s = \\frac{2}{5}Ma$.<br>Now substitute this expression for $f_s$ back into the linear force equation:<br>$Mg\\sin\\theta - \\frac{2}{5}Ma = Ma$<br>$Mg\\sin\\theta = Ma + \\frac{2}{5}Ma = \\frac{7}{5}Ma$<br>Canceling $M$, we find the acceleration: $a = \\frac{5}{7}g\\sin\\theta$.'
  },
  {
    id: 'mom_01',
    topic: 'Momentum',
    difficulty: 'medium',
    question: 'A $4 \\, \\text{kg}$ mass moving at $5 \\, \\text{m/s}$ has a one-dimensional, head-on elastic collision with a stationary $1 \\, \\text{kg}$ mass. What is the velocity of the $4 \\, \\text{kg}$ mass after the collision?',
    options: [{ text: '$1 \\, \\text{m/s}$' }, { text: '$2 \\, \\text{m/s}$' }, { text: '$3 \\, \\text{m/s}$' }, { text: '$4 \\, \\text{m/s}$' }],
    correctOptionIndex: 2,
    solution: 'For a one-dimensional elastic collision, we can use the formula for the final velocity of the first mass ($v_{1f}$):<br>$v_{1f} = \\left(\\frac{m_1-m_2}{m_1+m_2}\\right)v_{1i}$.<br/>Here, $m_1=4 \\, \\text{kg}$, $m_2=1 \\, \\text{kg}$, and $v_{1i}=5 \\, \\text{m/s}$.<br/>Plugging in the values: $v_{1f} = \\left(\\frac{4-1}{4+1}\\right)(5 \\, \\text{m/s}) = \\left(\\frac{3}{5}\\right)(5 \\, \\text{m/s}) = 3 \\, \\text{m/s}$.'
  },
  {
    id: 'osc_01',
    topic: 'Oscillations',
    difficulty: 'medium',
    question: 'A simple pendulum has a period of $2 \\, \\text{s}$ on Earth. What would its period be on the Moon, where the gravitational acceleration is approximately $g_{Earth}/6$?',
    options: [{ text: '$\\sqrt{6} \\, \\text{s}$' }, { text: '$12 \\, \\text{s}$' }, { text: '$2/6 \\, \\text{s}$' }, { text: '$2\\sqrt{6} \\, \\text{s}$' }],
    correctOptionIndex: 3,
    solution: 'The period $T$ of a simple pendulum is given by the formula $T = 2\\pi\\sqrt{L/g}$, where $L$ is the length and $g$ is the acceleration due to gravity. This shows that $T$ is inversely proportional to the square root of $g$, i.e., $T \\propto 1/\\sqrt{g}$.<br/>We can set up a ratio: $\\frac{T_{Moon}}{T_{Earth}} = \\frac{1/\\sqrt{g_{Moon}}}{1/\\sqrt{g_{Earth}}} = \\sqrt{\\frac{g_{Earth}}{g_{Moon}}}$.<br/>Given $g_{Moon} = g_{Earth}/6$, the ratio becomes $\\sqrt{\\frac{g_{Earth}}{g_{Earth}/6}} = \\sqrt{6}$.<br/>Therefore, $T_{Moon} = T_{Earth} \\cdot \\sqrt{6} = 2\\sqrt{6} \\, \\text{s}$.'
  },
  {
    id: 'grav_01',
    topic: 'Gravitation',
    difficulty: 'hard',
    question: 'A planet has twice the mass and half the radius of Earth. What is the escape velocity from this planet in terms of Earth\'s escape velocity, $v_E$?',
    options: [{ text: '$v_E$' }, { text: '$\\sqrt{2} v_E$' }, { text: '$2 v_E$' }, { text: '$4 v_E$' }],
    correctOptionIndex: 2,
    solution: 'The escape velocity from a celestial body is given by the formula $v_{esc} = \\sqrt{\\frac{2GM}{R}}$.<br/>For Earth, $v_E = \\sqrt{\\frac{2GM_E}{R_E}}$.<br/>For the new planet, the mass is $M_p = 2M_E$ and the radius is $R_p = R_E/2$.<br/>The escape velocity from the planet ($v_p$) is: $v_p = \\sqrt{\\frac{2G(2M_E)}{(R_E/2)}} = \\sqrt{\\frac{4GM_E}{R_E/2}} = \\sqrt{4 \\cdot \\frac{2GM_E}{R_E}}$.<br/>We can factor out the 4: $v_p = \\sqrt{4} \\cdot \\sqrt{\\frac{2GM_E}{R_E}} = 2 v_E$.'
  },
];

const resourceDatabase: Resource[] = [
    { title: 'AAPT Past Exams', url: 'https://www.aapt.org/physicsteam/pastexams.cfm', description: 'Official source for past F=ma and USAPhO exams.'},
    { title: 'Introduction to Classical Mechanics (Morin)', url: 'https://physicscourses.colorado.edu/phys1110/phys1110_fa19/DavidMorin_IntroductionToClassicalMechanics.pdf', description: 'Challenging and comprehensive text with excellent problems.'},
    { title: 'HyperPhysics', url: 'http://hyperphysics.phy-astr.gsu.edu/hbase/index.html', description: 'A concept map-based resource for a wide range of topics.'},
];

const formularyDatabase: Record<string, Formula[]> = {
    'Kinematics': [
        { name: 'Velocity-Time', equation: 'v = v_0 + at', description: 'Final velocity under constant acceleration.'},
        { name: 'Position-Time', equation: 'x = x_0 + v_0t + \\frac{1}{2}at^2', description: 'Final position under constant acceleration.'},
        { name: 'Velocity-Position', equation: 'v^2 = v_0^2 + 2a\\Delta x', description: 'Final velocity without time dependence.'},
    ],
    'Dynamics': [
        { name: "Newton's Second Law", equation: '\\sum \\vec{F} = m\\vec{a}', description: 'Net force equals mass times acceleration.'},
        { name: 'Static/Kinetic Friction', equation: 'f \\le \\mu N', description: 'Frictional force is proportional to the normal force.'},
    ],
    'Rotational Motion': [
        { name: "Torque", equation: '\\vec{\\tau} = \\vec{r} \\times \\vec{F}', description: 'Rotational equivalent of force.'},
        { name: "Newton's Second Law (Rotation)", equation: '\\sum \\tau = I\\alpha', description: 'Net torque equals moment of inertia times angular acceleration.'},
    ],
};

const notesDatabase: TopicNote[] = [
    {
        topic: 'Kinematics',
        content: `<h3>Core Concepts</h3>
        Kinematics describes motion without considering its causes. The key variables are displacement ($x$), velocity ($v$), and acceleration ($a$). For **constant acceleration**, which is common in F=ma problems, the following equations are fundamental:
        <ul>
          <li>$v = v_0 + at$</li>
          <li>$\\Delta x = v_0t + \\frac{1}{2}at^2$</li>
          <li>$v^2 = v_0^2 + 2a\\Delta x$</li>
          <li>$\\Delta x = \\frac{v_0+v}{2}t$</li>
        </ul>
        For motion in two dimensions, treat the $x$ and $y$ components independently. Projectile motion is a classic example where acceleration in the x-direction is $a_x = 0$ and acceleration in the y-direction is $a_y = -g$.`
    },
    {
        topic: 'Dynamics',
        content: `<h3>Core Concepts</h3>
        Dynamics connects forces to motion, governed by **Newton's Laws**.
        <ol>
          <li><b>First Law (Inertia):</b> An object remains at rest or in constant velocity motion unless acted upon by a net external force.</li>
          <li><b>Second Law:</b> The net force on an object is equal to its mass times its acceleration ($\\sum \\vec{F} = m\\vec{a}$). This is the most important equation in classical mechanics.</li>
          <li><b>Third Law:</b> For every action, there is an equal and opposite reaction.</li>
        </ol>
        <h4>Problem-Solving Strategy:</h4>
        <p>1. Draw a Free-Body Diagram (FBD) for every object of interest. 2. Choose a coordinate system. 3. Apply $\\sum F = ma$ to each axis.</p>`
    }
];

const TOPICS = ['Kinematics', 'Dynamics', 'Energy & Work', 'Momentum', 'Rotational Motion', 'Oscillations', 'Gravitation'];
const XP_PER_CORRECT = 25;


const KatexRenderer: React.FC<{ content: string, isDisplayMode?: boolean }> = ({ content, isDisplayMode = false }) => {
    const renderRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const katex = (window as any).katex;
        if (renderRef.current && katex) {
            let processedContent = content.replace(/\$\$([^\$]+)\$\$/g, (match, p1) => {
                 try {
                    return katex.renderToString(p1, { throwOnError: false, displayMode: true });
                } catch (e) { return match; }
            });
            processedContent = processedContent.replace(/\$([^\$]+)\$/g, (match, p1) => {
                try {
                    return katex.renderToString(p1, { throwOnError: false, displayMode: false });
                } catch (e) { return match; }
            });
            renderRef.current.innerHTML = processedContent;
        } else if (renderRef.current) {
            renderRef.current.innerHTML = content;
        }
    }, [content, isDisplayMode]);

    return <div ref={renderRef} style={{ display: 'contents' }}/>;
};

const ProgressBar: React.FC<{ value: number, max: number, label: string }> = ({ value, max, label }) => {
    const percentage = max > 0 ? (value / max) * 100 : 0;
    return (
        <div className="progress-bar-container">
            <div className="progress-bar-label">{label}</div>
            <div className="progress-bar-track">
                <div className="progress-bar-fill" style={{ width: `${percentage}%` }}></div>
            </div>
        </div>
    );
};

const PracticeSummaryModal: React.FC<{ score: number, total: number, xpGained: number, onClose: () => void }> = ({ score, total, xpGained, onClose }) => {
    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Session Complete!</h2>
                <p className="summary-score">Your Score: {score} / {total}</p>
                <p className="summary-xp">XP Gained: +{xpGained}</p>
                <button className="cta-button" onClick={onClose}>Return to Setup</button>
            </div>
        </div>
    );
};

const Navbar: React.FC<{ setPage: (page: string) => void; xp: number }> = ({ setPage, xp }) => {
    const currentTier = tiers.slice().reverse().find(t => xp >= t.minXp) || tiers[0];
    const nextTier = tiers.find(t => t.minXp > xp);
    const xpForNextTier = nextTier ? nextTier.minXp - (currentTier.minXp) : 0;
    const xpInCurrentTier = xp - currentTier.minXp;

    return (
        <nav className="navbar">
            <div className="navbar-brand" onClick={() => setPage('home')}>
                <svg className="logo-icon" viewBox="0 0 24 24"><path d="M12 2c5.523 0 10 3.582 10 8s-4.477 8-10 8S2 15.523 2 10 6.477 2 12 2zm0 2c-4.418 0-8 2.686-8 6s3.582 6 8 6 8-2.686 8-6-3.582-6-8-6zm0 2a4 4 0 1 1 0 8 4 4 0 0 1 0-8zm0 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4z"></path></svg>
                USAPhO Guide
            </div>
            <div className="navbar-xp-tier">
                <span>{currentTier.name} ({xp} XP)</span>
                {nextTier && <ProgressBar value={xpInCurrentTier} max={xpForNextTier} label="" />}
            </div>
            <div className="navbar-links">
                <button onClick={() => setPage('practice')}>Practice</button>
                <button onClick={() => setPage('notes')}>Notes</button>
                <button onClick={() => setPage('formulary')}>Formulary</button>
                <button onClick={() => setPage('resources')}>Resources</button>
            </div>
        </nav>
    );
};

const HomePage: React.FC<{ setPage: (page: string) => void }> = ({ setPage }) => (
    <div className="home-page">
        <div className="hero-section">
            <h1>Master the Fundamentals. Conquer the Exam.</h1>
            <p>Your ultimate training ground for F=ma & USAPhO. Dive into challenging problems, timed practice, detailed notes, and level up your skills.</p>
            <button className="cta-button" onClick={() => setPage('practice')}>Start Practicing Now</button>
        </div>
    </div>
);

const ResourcesPage: React.FC = () => (
    <div className="page-container">
        <h2>Curated Learning Resources</h2>
        <div className="resource-list">
            {resourceDatabase.map(res => (
                <a key={res.title} href={res.url} target="_blank" rel="noopener noreferrer" className="resource-card">
                    <h3>{res.title}</h3><p>{res.description}</p><span>Visit Resource &rarr;</span>
                </a>
            ))}
        </div>
    </div>
);

const FormularyPage: React.FC = () => (
    <div className="page-container">
        <h2>Essential Formulary</h2>
        {Object.entries(formularyDatabase).map(([topic, formulas]) => (
            <div key={topic} className="formulary-topic-section">
                <h3>{topic}</h3>
                <div className="formulary-list">
                    {formulas.map(f => (
                        <div key={f.name} className="formula-card">
                            <div className="formula-equation"><KatexRenderer content={`$${f.equation}$`} /></div>
                            <div className="formula-details">
                                <strong>{f.name}</strong>: {f.description}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        ))}
    </div>
);

const NotesPage: React.FC<{ setPage: (page: string, state?: any) => void }> = ({ setPage }) => (
    <div className="page-container">
        <h2>Topic Notes</h2>
        <div className="topic-selector notes-grid">
             {TOPICS.map(topic => (
                <button
                    key={topic}
                    onClick={() => setPage('notesDetail', { topic })}
                    className="topic-btn"
                >
                    {topic}
                </button>
            ))}
        </div>
    </div>
);

const TopicNotesDetail: React.FC<{ topic: string, setPage: (page: string) => void }> = ({ topic, setPage }) => {
    const note = notesDatabase.find(n => n.topic === topic);
    return (
        <div className="page-container">
            <button className="back-button" onClick={() => setPage('notes')}>&larr; Back to Topics</button>
            <h2>Notes: {topic}</h2>
            {note ? (
                <div className="notes-content-card">
                    <KatexRenderer content={note.content} />
                </div>
            ) : (
                <p>Notes for this topic are not yet available.</p>
            )}
        </div>
    );
};

const PracticePage: React.FC<{ addXp: (xp: number) => void }> = ({ addXp }) => {
    const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
    const [practiceProblems, setPracticeProblems] = useState<Problem[]>([]);
    const [currentProblemIndex, setCurrentProblemIndex] = useState(0);
    const [userAnswer, setUserAnswer] = useState<number | null>(null);
    const [showSolution, setShowSolution] = useState(false);
    const [score, setScore] = useState(0);
    const [sessionStarted, setSessionStarted] = useState(false);
    const [isTimed, setIsTimed] = useState(false);
    const [timeLeft, setTimeLeft] = useState(0);
    const [showSummary, setShowSummary] = useState(false);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (sessionStarted && isTimed && timeLeft > 0) {
            timerRef.current = setTimeout(() => setTimeLeft(t => t - 1), 1000);
        } else if (timeLeft === 0 && isTimed && sessionStarted) {
            endSession();
        }
        return () => { if (timerRef.current) clearTimeout(timerRef.current); };
    }, [timeLeft, isTimed, sessionStarted]);

    const startPractice = () => {
        let problems = problemDatabase.filter(p => selectedTopics.includes(p.topic));
        problems = problems.sort(() => Math.random() - 0.5);
        setPracticeProblems(problems);
        setCurrentProblemIndex(0);
        setUserAnswer(null); setShowSolution(false); setScore(0);
        if (isTimed) setTimeLeft(problems.length * 90); // 90 seconds per question
        setSessionStarted(true);
    };

    const handleAnswerSelect = (optionIndex: number) => {
        if (showSolution) return;
        setUserAnswer(optionIndex);
        if (optionIndex === practiceProblems[currentProblemIndex].correctOptionIndex) {
            setScore(prev => prev + 1);
        }
        setShowSolution(true);
    };
    
    const endSession = () => {
        if (timerRef.current) clearTimeout(timerRef.current);
        const xpGained = score * XP_PER_CORRECT;
        addXp(xpGained);
        setShowSummary(true);
    }

    const goToNextProblem = () => {
        if (currentProblemIndex < practiceProblems.length - 1) {
            setCurrentProblemIndex(prev => prev + 1);
            setUserAnswer(null); setShowSolution(false);
        } else {
            endSession();
        }
    };
    
    const resetPractice = () => {
        setSessionStarted(false); setShowSummary(false);
        setSelectedTopics([]); setPracticeProblems([]);
        if(timerRef.current) clearTimeout(timerRef.current);
    }

    if (showSummary) {
        return <PracticeSummaryModal score={score} total={practiceProblems.length} xpGained={score * XP_PER_CORRECT} onClose={resetPractice} />;
    }

    if (!sessionStarted) {
        return (
            <div className="page-container setup-container">
                <h2>Practice Setup</h2>
                <div className="topic-selector">
                    {TOPICS.map(topic => (
                        <button key={topic} onClick={() => setSelectedTopics(p => p.includes(topic) ? p.filter(t => t !== topic) : [...p, topic])}
                            className={`topic-btn ${selectedTopics.includes(topic) ? 'selected' : ''}`}>{topic}</button>
                    ))}
                </div>
                <div className="practice-options">
                    <label>
                        <input type="checkbox" checked={isTimed} onChange={() => setIsTimed(p => !p)} />
                        Timed Practice (90s/question)
                    </label>
                </div>
                <button className="cta-button" onClick={startPractice} disabled={selectedTopics.length === 0}>
                    Start Practice ({problemDatabase.filter(p => selectedTopics.includes(p.topic)).length} Questions)
                </button>
            </div>
        );
    }
    
    const problem = practiceProblems[currentProblemIndex];

    return (
        <div className="page-container practice-container">
            <div className="practice-header">
                <h3>Topic: {problem.topic}</h3>
                {isTimed && <div className="timer">Time: {Math.floor(timeLeft / 60)}:{('0' + timeLeft % 60).slice(-2)}</div>}
                <span>Question {currentProblemIndex + 1} of {practiceProblems.length}</span>
            </div>
            <div className="problem-card">
                <div className="question-section">
                    <h4>Question:</h4>
                    <KatexRenderer content={problem.question} />
                </div>
                <div className="options-section">
                    {problem.options.map((option, index) => {
                        let btnClass = 'option-btn';
                        if (showSolution) {
                            if (index === problem.correctOptionIndex) btnClass += ' correct';
                            else if (index === userAnswer) btnClass += ' incorrect';
                        }
                        return (<button key={index} className={btnClass} onClick={() => handleAnswerSelect(index)} disabled={showSolution}>
                                <KatexRenderer content={option.text} />
                            </button>);
                    })}
                </div>
                {showSolution && <div className="solution-section"><h4>Solution:</h4><KatexRenderer content={problem.solution} /></div>}
            </div>
            <div className="practice-footer">
                <button onClick={endSession}>End Session</button>
                {showSolution && <button onClick={goToNextProblem} className="cta-button">Next Problem &rarr;</button>}
            </div>
        </div>
    );
};

export default function App() {
    const [page, setPage] = useState('home');
    const [pageState, setPageState] = useState<any>(null);
    const [xp, setXp] = useState(() => Number(localStorage.getItem('physicsAppXp')) || 0);

    useEffect(() => localStorage.setItem('physicsAppXp', xp.toString()), [xp]);
    
    useEffect(() => {
        const katexStylesheet = document.createElement('link');
        katexStylesheet.href = "https://cdn.jsdelivr.net/npm/katex@0.16.10/dist/katex.min.css";
        katexStylesheet.rel = "stylesheet";
        document.head.appendChild(katexStylesheet);

        const katexScript = document.createElement('script');
        katexScript.src = "https://cdn.jsdelivr.net/npm/katex@0.16.10/dist/katex.min.js";
        katexScript.async = true;
        document.head.appendChild(katexScript);

        return () => {
            document.head.removeChild(katexStylesheet);
            document.head.removeChild(katexScript);
        };
    }, []);

    const handleSetPage = (newPage: string, state?: any) => {
        setPage(newPage);
        setPageState(state);
    }
    
    const addXp = (amount: number) => setXp(prev => prev + amount);

    const renderPage = () => {
        switch (page) {
            case 'practice': return <PracticePage addXp={addXp} />;
            case 'resources': return <ResourcesPage />;
            case 'formulary': return <FormularyPage />;
            case 'notes': return <NotesPage setPage={handleSetPage} />;
            case 'notesDetail': return <TopicNotesDetail topic={pageState?.topic} setPage={handleSetPage} />;
            default: return <HomePage setPage={handleSetPage} />;
        }
    };

    return (
        <>
            <style>{`
                :root {
                    --bg-color: #0d1117; --surface-color: #161b22; --primary-color: #58a6ff; --primary-variant: #1f6feb;
                    --secondary-color: #3fb950; --text-color: #c9d1d9; --text-secondary: #8b949e;
                    --border-color: #30363d; --correct-color: #3fb950; --incorrect-color: #f85149;
                    --font-sans: 'Segoe UI', 'Inter', -apple-system, BlinkMacSystemFont, Roboto, 'Helvetica Neue', Arial, sans-serif;
                    --font-serif: 'Georgia', 'Times New Roman', serif;
                }
                html, body, #root { font-family: var(--font-sans); background-color: var(--bg-color); color: var(--text-color); line-height: 1.6; }
                *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
                .navbar { display: flex; justify-content: space-between; align-items: center; padding: 1rem 2rem; background-color: rgba(13, 17, 23, 0.8); backdrop-filter: blur(10px); border-bottom: 1px solid var(--border-color); position: sticky; top: 0; z-index: 1000; gap: 1rem; flex-wrap: wrap; }
                .navbar-brand { font-size: 1.4rem; font-weight: 600; display: flex; align-items: center; gap: 0.75rem; cursor: pointer; color: var(--text-color); }
                .logo-icon { width: 32px; height: 32px; color: var(--primary-color); fill: currentColor; }
                .navbar-xp-tier { display: flex; align-items: center; gap: 1rem; font-size: 0.9rem; flex-grow: 1; min-width: 200px; }
                .navbar-links { display: flex; gap: 0.5rem; }
                .navbar-links button { color: var(--text-secondary); font-weight: 500; padding: 8px 12px; background: none; border: none; cursor: pointer; border-radius: 6px; }
                .navbar-links button:hover { color: var(--primary-color); background-color: rgba(88,166,255,0.1); }
                .page-container { padding: 2rem; max-width: 900px; margin: 2rem auto; width: 100%; }
                h2 { font-size: 2.5rem; text-align: center; margin-bottom: 2rem; }
                h3 { color: var(--secondary-color); margin-bottom: 1.5rem; font-size: 1.75rem;}
                .cta-button { background-color: var(--primary-color); color: var(--bg-color); font-weight: bold; padding: 12px 24px; border:none; border-radius: 8px; cursor:pointer; transition: all 0.2s; }
                .cta-button:hover { background-color: var(--secondary-color); transform: translateY(-2px); }
                .hero-section { text-align: center; max-width: 750px; margin: 4rem auto; }
                .hero-section h1 { font-size: 3.5rem; font-weight: 800; margin-bottom: 1rem; color: var(--text-color); }
                .hero-section p { font-size: 1.25rem; color: var(--text-secondary); margin-bottom: 2.5rem; }
                .resource-list { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1.5rem; }
                .resource-card { background-color: var(--surface-color); border-radius: 12px; padding: 1.5rem; text-decoration: none; color: var(--text-color); border: 1px solid var(--border-color); transition: all 0.2s; }
                .resource-card:hover { transform: translateY(-5px); border-color: var(--primary-color); }
                .resource-card h3 { color: var(--primary-color); font-size: 1.25rem; margin-bottom: 0.5rem; } .resource-card p { color: var(--text-secondary); } .resource-card span { color: var(--secondary-color); }
                .topic-selector { display: flex; flex-wrap: wrap; justify-content: center; gap: 1rem; margin-bottom: 2rem; }
                .topic-btn { background-color: var(--surface-color); border: 1px solid var(--border-color); color: var(--text-secondary); border-radius: 8px; padding: 10px 20px; cursor: pointer; transition: all 0.2s; }
                .topic-btn.selected { background-color: var(--primary-variant); color: #fff; border-color: var(--primary-color); }
                .practice-container, .setup-container { max-width: 800px; background-color: var(--surface-color); border-radius: 12px; border: 1px solid var(--border-color); padding: 2rem;}
                .practice-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; color: var(--text-secondary); }
                .practice-header h3 { font-size: 1.25rem; margin-bottom: 0;}
                .timer { font-weight: bold; color: var(--primary-color); font-size: 1.2rem; }
                .problem-card { padding: 1rem 0; }
                .question-section, .solution-section { font-family: var(--font-serif); font-size: 1.2rem; margin-bottom: 2rem; line-height: 1.7; }
                .question-section h4, .solution-section h4 { font-family: var(--font-sans); font-size: 1rem; font-weight: bold; color: var(--secondary-color); margin-bottom: 1rem; text-transform: uppercase; letter-spacing: 1px; }
                .options-section { display: grid; gap: 1rem; }
                .option-btn { text-align: left; padding: 1rem; background-color: rgba(88,166,255,0.05); border: 1px solid var(--border-color); color: var(--text-color); border-radius:8px; cursor:pointer; }
                .option-btn:not(:disabled):hover { border-color: var(--primary-color); background-color: rgba(88,166,255,0.1); }
                .option-btn.correct { background-color: rgba(63, 185, 80, 0.15); border-color: var(--correct-color); color: var(--correct-color); font-weight: bold; }
                .option-btn.incorrect { background-color: rgba(248, 81, 73, 0.15); border-color: var(--incorrect-color); color: var(--incorrect-color); font-weight: bold; }
                .solution-section { margin-top: 2rem; padding-top: 1.5rem; border-top: 1px dashed var(--border-color); }
                .practice-footer { display: flex; justify-content: space-between; align-items: center; margin-top: 1.5rem; }
                .practice-footer button { background-color: var(--surface-color); border: 1px solid var(--border-color); }
                .practice-options { margin-bottom: 2rem; text-align:center; color: var(--text-secondary); }
                .practice-options input { margin-right: 0.5rem; }
                .progress-bar-container { width: 100%; }
                .progress-bar-label { font-size: 0.8rem; color: var(--text-secondary); }
                .progress-bar-track { background-color: #010409; border-radius: 4px; height: 8px; width: 100%; overflow: hidden; }
                .progress-bar-fill { background: linear-gradient(90deg, var(--primary-color), var(--secondary-color)); height: 100%; border-radius: 4px; transition: width 0.3s ease; }
                .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.7); display: flex; align-items: center; justify-content: center; z-index: 2000; }
                .modal-content { background: var(--surface-color); padding: 2rem 3rem; border-radius: 12px; text-align: center; border: 1px solid var(--border-color); }
                .summary-score { font-size: 1.5rem; margin: 1rem 0; }
                .summary-xp { font-size: 1.2rem; color: var(--secondary-color); font-weight: bold; margin-bottom: 2rem; }
                .formulary-topic-section { margin-bottom: 3rem; }
                .formulary-list { display: flex; flex-direction: column; gap: 1rem; }
                .formula-card { display: flex; align-items: center; background: var(--surface-color); border: 1px solid var(--border-color); border-radius: 8px; padding: 1rem; gap: 1.5rem; }
                .formula-equation { font-size: 1.5rem; color: var(--primary-color); }
                .notes-grid { grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); display: grid; }
                .notes-content-card { background-color: var(--surface-color); padding: 2rem; border-radius: 8px; border: 1px solid var(--border-color); line-height: 1.8; }
                .notes-content-card h3, .notes-content-card h4 { color: var(--primary-color); margin-top: 1.5rem; margin-bottom: 1rem; font-size: 1.5rem; font-family: var(--font-sans);}
                .notes-content-card ul, .notes-content-card ol { margin-left: 1.5rem; }
                .back-button { background: none; border: none; color: var(--primary-color); cursor: pointer; margin-bottom: 1.5rem; font-size: 1rem; }
            `}</style>
            <div className="App">
                <Navbar setPage={handleSetPage} xp={xp} />
                <main>
                    {renderPage()}
                </main>
            </div>
        </>
    );
}
