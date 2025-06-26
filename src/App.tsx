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
    content: string;
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
    { title: 'AAPT Past Exams', url: 'https://www.aapt.org/Common2022/pastexams.cfm', description: 'Official source for past F=ma and USAPhO exams.'},
    { title: 'US Physics Team Handouts', url: 'https://knzhou.github.io/', description: 'Check "Teaching" section for problems.'},
    { title: 'ΣF=ma Topics by Question', url: 'https://kevinshuang.com/teaching/resources/', description: 'A list of topics by question on each years ΣF=ma exam.'},
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
        <p>Kinematics is the language of motion. It's all about describing how things move without getting bogged down by *why* they move. Your goal is to become fluent in the variables: displacement ($x$), velocity ($v$), and acceleration ($a$). For the vast majority of F=ma and USAPhO problems, you'll be dealing with <strong>constant acceleration</strong>. These four equations are your bread and butter; know them so well you could recite them in your sleep.</p>
        <ul>
          <li>$v = v_0 + at$  (Velocity as a function of time)</li>
          <li>$\\Delta x = v_0t + \\frac{1}{2}at^2$ (Position as a function of time)</li>
          <li>$v^2 = v_0^2 + 2a\\Delta x$ (The "timeless" equation - very useful when time isn't given or asked for)</li>
          <li>$\\Delta x = \\frac{v_0+v}{2}t$ (Position as a function of average velocity)</li>
        </ul>
        <p>When motion goes 2D, like a cannonball flying through the air (a classic projectile motion problem), the secret is to break it down. Treat the horizontal ($x$) and vertical ($y$) motions as two separate, one-dimensional problems. They are linked only by the time variable, $t$. For projectiles near Earth's surface, you'll almost always use $a_x = 0$ (constant velocity) and $a_y = -g$ (constant acceleration downwards).</p>`
    },
    {
        topic: 'Dynamics',
        content: `<h3>Core Concepts</h3>
        <p>If kinematics is the 'how', dynamics is the 'why'. It's the heart of classical mechanics, and it's all built on the foundation of <strong>Newton's Laws</strong>.</p>
        <ol>
          <li><b>First Law (Inertia):</b> An object in motion stays in motion, an object at rest stays at rest, unless a net external force messes with it. Basically, objects don't change their velocity on their own.</li>
          <li><b>Second Law:</b> The big one. The powerhouse equation of physics: $\\sum \\vec{F} = m\\vec{a}$. The net force on an object is directly proportional to its acceleration. Master this, and you're halfway there. Remember that both force and acceleration are vectors, so you'll be applying this law along your coordinate axes.</li>
          <li><b>Third Law:</b> Forces come in pairs. For every "action" force, there's an equal and opposite "reaction" force. If your finger pushes on a wall, the wall pushes back on your finger with the same force. This is crucial for analyzing systems with multiple objects.</li>
        </ol>
        <h4>Problem-Solving Strategy: The Unbreakable Routine</h4>
        <p>For nearly any dynamics problem, follow these steps religiously:</p>
        <p>1. <strong>Draw a Free-Body Diagram (FBD)</strong> for every single object you care about. Isolate the object and draw all the forces acting *on* it. Don't draw forces the object exerts on other things. This is the single most important step. <br>2. <strong>Choose a Coordinate System.</strong> Often, tilting your axes to align with the acceleration can save you a lot of trigonometry. <br>3. <strong>Apply $\\sum F = ma$</strong> to each axis. For an object in equilibrium (not accelerating), this simplifies to $\\sum F = 0$.</p>`
    },
    {
        topic: 'Energy & Work',
        content: `<h3>Core Concepts</h3>
        <p>Energy methods are often the "easy way out" of a complicated dynamics problem. If you don't care about time or specific forces, think about energy. It's a scalar, which makes it easier to work with than vector forces.</p>
        <ul>
            <li><strong>Work ($W$):</strong> Work is done when a force causes displacement. It's defined as $W = \\vec{F} \\cdot \\vec{d} = Fd\\cos\\theta$. Only the component of the force parallel to the displacement does work.</li>
            <li><strong>Kinetic Energy ($K$):</strong> The energy of motion. $K = \\frac{1}{2}mv^2$.</li>
            <li><strong>Work-Energy Theorem:</strong> This is the crucial link between dynamics and energy. The <em>net</em> work done on an object equals its change in kinetic energy: $W_{net} = \\Delta K$. This is a powerful shortcut.</li>
            <li><strong>Potential Energy ($U$):</strong> Stored energy. For F=ma, you'll mainly see two types:
                <ul>
                    <li>Gravitational: $U_g = mgh$ (near a planet's surface)</li>
                    <li>Elastic (Spring): $U_s = \\frac{1}{2}kx^2$, where $k$ is the spring constant.</li>
                </ul>
            </li>
            <li><strong>Conservation of Mechanical Energy:</strong> If only conservative forces (like gravity and ideal springs) do work, then the total mechanical energy $E = K + U$ of a system doesn't change. So, $K_i + U_i = K_f + U_f$.</li>
            <li><strong>Beyond Conservation:</strong> If non-conservative forces like friction are present, mechanical energy is <em>not</em> conserved. The work done by these forces equals the change in total mechanical energy: $W_{friction} = \\Delta E = (K_f + U_f) - (K_i + U_i)$.</li>
            <li><strong>Power ($P$):</strong> The rate at which work is done. $P_{avg} = \\frac{W}{t}$, and the instantaneous power is $P = \\frac{dW}{dt} = \\vec{F} \\cdot \\vec{v}$.</li>
        </ul>`
    },
    {
        topic: 'Momentum',
        content: `<h3>Core Concepts</h3>
        <p>Momentum is all about collisions and interactions within a system. It's another vector quantity, and its conservation is one of the most fundamental principles in physics.</p>
        <ul>
            <li><strong>Linear Momentum ($\vec{p}$):</strong> Defined as $\\vec{p} = m\\vec{v}$. Think of it as "mass in motion."</li>
            <li><strong>Impulse ($\vec{J}$):</strong> The change in momentum. It's caused by a force acting over a period of time: $\\vec{J} = \\int \\vec{F} dt = \\Delta \\vec{p}$. This is really just Newton's second law in a different suit: $\\vec{F} = \\frac{d\\vec{p}}{dt}$.</li>
            <li><strong>Conservation of Linear Momentum:</strong> This is the main event. If the <em>net external force</em> on a system of objects is zero, the total momentum of that system is conserved. $\\sum \\vec{p}_{initial} = \\sum \\vec{p}_{final}$. This is why it's so useful for analyzing explosions and collisions, where the internal forces are huge but brief, and external forces (like gravity) are negligible during the interaction.</li>
        </ul>
        <h4>Types of Collisions:</h4>
        <ol>
            <li><strong>Elastic:</strong> Both momentum and kinetic energy are conserved. The objects bounce off each other perfectly.</li>
            <li><strong>Inelastic:</strong> Momentum is conserved, but kinetic energy is not. Some energy is lost to heat, sound, or deformation.</li>
            <li><strong>Perfectly Inelastic:</strong> The objects stick together after the collision. Momentum is still conserved, but the maximum possible kinetic energy is lost.</li>
        </ol>
        <p><strong>Center of Mass (CM):</strong> The center of mass of a system is a weighted average of the positions of its parts. The velocity of the CM is special: $\\vec{v}_{cm} = \\frac{\\sum m_i \\vec{v}_i}{M_{total}} = \\frac{\\vec{p}_{total}}{M_{total}}$. If there are no external forces, $\\vec{p}_{total}$ is constant, which means the Center of Mass moves at a constant velocity, regardless of how complex the interactions are within the system!</p>`
    },
    {
        topic: 'Rotational Motion',
        content: `<h3>Core Concepts</h3>
        <p>Think of rotational motion as a complete parallel to the linear motion you already know. For every concept in kinematics and dynamics, there is a rotational analog. The key is to learn the new variables and their relationships.</p>
        <h4>The Analogy is Everything:</h4>
        <table style="width:100%; border-collapse: collapse; color: var(--text-color);">
            <thead>
                <tr>
                    <th style="background-color: #2d3436; color: #ffffff; padding: 12px 15px; border: 1px solid #454d55; text-align: left;">Linear Concept</th>
                    <th style="background-color: #2d3436; color: #ffffff; padding: 12px 15px; border: 1px solid #454d55; text-align: left;">Rotational Analog</th>
                    <th style="background-color: #2d3436; color: #ffffff; padding: 12px 15px; border: 1px solid #454d55; text-align: left;">Relationship</th>
                </tr>
            </thead>
            <tbody>
                <tr><td style="padding: 8px; border: 1px solid var(--border-color);">Position ($x$)</td><td style="padding: 8px; border: 1px solid var(--border-color);">Angle ($\\theta$)</td><td style="padding: 8px; border: 1px solid var(--border-color);">$x = r\\theta$</td></tr>
                <tr><td style="padding: 8px; border: 1px solid var(--border-color);">Velocity ($v$)</td><td style="padding: 8px; border: 1px solid var(--border-color);">Angular Velocity ($\\omega$)</td><td style="padding: 8px; border: 1px solid var(--border-color);">$v = r\\omega$</td></tr>
                <tr><td style="padding: 8px; border: 1px solid var(--border-color);">Acceleration ($a$)</td><td style="padding: 8px; border: 1px solid var(--border-color);">Angular Acceleration ($\\alpha$)</td><td style="padding: 8px; border: 1px solid var(--border-color);">$a_{tan} = r\\alpha$</td></tr>
                <tr><td style="padding: 8px; border: 1px solid var(--border-color);">Mass ($m$, inertia)</td><td style="padding: 8px; border: 1px solid var(--border-color);">Moment of Inertia ($I$)</td><td style="padding: 8px; border: 1px solid var(--border-color);">$I = \\sum m_i r_i^2$</td></tr>
                <tr><td style="padding: 8px; border: 1px solid var(--border-color);">Force ($F$)</td><td style="padding: 8px; border: 1px solid var(--border-color);">Torque ($\\tau$)</td><td style="padding: 8px; border: 1px solid var(--border-color);">$\\vec{\\tau} = \\vec{r} \\times \\vec{F}$</td></tr>
                <tr><td style="padding: 8px; border: 1px solid var(--border-color);">$\\sum F = ma$</td><td style="padding: 8px; border: 1px solid var(--border-color);">$\\sum \\tau = I\\alpha$</td><td style="padding: 8px; border: 1px solid var(--border-color);">Newton's 2nd Law for Rotation</td></tr>
                <tr><td style="padding: 8px; border: 1px solid var(--border-color);">Momentum ($p=mv$)</td><td style="padding: 8px; border: 1px solid var(--border-color);">Angular Momentum ($L=I\\omega$)</td><td style="padding: 8px; border: 1px solid var(--border-color);">$\\vec{L} = \\vec{r} \\times \\vec{p}$</td></tr>
                <tr><td style="padding: 8px; border: 1px solid var(--border-color);">Kinetic Energy ($K=\\frac{1}{2}mv^2$)</td><td style="padding: 8px; border: 1px solid var(--border-color);">Rotational K ($K=\\frac{1}{2}I\\omega^2$)</td><td style="padding: 8px; border: 1px solid var(--border-color);">Energy of Rotation</td></tr>
            </tbody>
        </table>
        <p><strong>Rolling Without Slipping:</strong> This is a common and important special case. It connects translation and rotation. An object that rolls without slipping has a total kinetic energy that is the sum of its translational and rotational kinetic energies: $K_{total} = K_{trans} + K_{rot} = \\frac{1}{2}mv_{cm}^2 + \\frac{1}{2}I_{cm}\\omega^2$. The no-slip condition is $v_{cm} = R\\omega$.</p>
        <p><strong>Conservation of Angular Momentum:</strong> Just as momentum is conserved when there's no net external force, angular momentum ($\vec{L}$) is conserved when there's no net external <em>torque</em>. This is why an ice skater spins faster when they pull their arms in: their moment of inertia ($I$) decreases, so their angular velocity ($\omega$) must increase to keep $L = I\omega$ constant.</p>`
    },
    {
        topic: 'Oscillations',
        content: `<h3>Core Concepts</h3>
        <p>Oscillations are everywhere, from a swinging pendulum to the vibrations of an atom. The most important type to master is <strong>Simple Harmonic Motion (SHM)</strong>. An object undergoes SHM if it experiences a restoring force proportional to its displacement from equilibrium: $F_{restore} = -kx$.</p>
        <p>The equation of motion for SHM is $\\frac{d^2x}{dt^2} + \\omega^2 x = 0$. Don't let the calculus scare you; the important thing is its solution:</p>
        <ul>
            <li><strong>Position:</strong> $x(t) = A\\cos(\\omega t + \\phi)$</li>
            <li>$A$ is the <strong>Amplitude</strong>: the maximum displacement from equilibrium.</li>
            <li>$\\omega$ is the <strong>Angular Frequency</strong>: it dictates how fast the oscillations are. It's the most important parameter!</li>
            <li>$\\phi$ is the <strong>Phase Constant</strong>: it's determined by the initial conditions (where the object is at $t=0$).</li>
        </ul>
        <h4>Key Formulas for Period ($T$) and Angular Frequency ($\\omega$):</h4>
        <p>The period $T$ is the time for one full oscillation, and it's related to $\\omega$ by $T = \\frac{2\\pi}{\\omega}$.</p>
        <ul>
            <li><strong>Mass-Spring System:</strong> $\\omega = \\sqrt{\\frac{k}{m}}$, so $T = 2\\pi\\sqrt{\\frac{m}{k}}$. Notice that the period does <em>not</em> depend on the amplitude!</li>
            <li><strong>Simple Pendulum (small angles):</strong> $\\omega = \\sqrt{\\frac{g}{L}}$, so $T = 2\\pi\\sqrt{\\frac{L}{g}}$. The small angle approximation ($\\sin\\theta \\approx \\theta$) is what makes this simple harmonic motion.</li>
            <li><strong>Physical Pendulum:</strong> For any object swinging about a pivot point, $T = 2\\pi\\sqrt{\\frac{I}{mgd}}$, where $I$ is the moment of inertia about the pivot and $d$ is the distance from the pivot to the center of mass.</li>
        </ul>
        <p><strong>Energy in SHM:</strong> In an ideal SHM system, total mechanical energy is conserved. It continuously transforms between potential and kinetic energy. The total energy is constant and can be expressed as $E = K + U = \\frac{1}{2}mv^2 + \\frac{1}{2}kx^2 = \\frac{1}{2}kA^2$. At the endpoints ($x=\\pm A$), all the energy is potential. At the equilibrium point ($x=0$), all the energy is kinetic.</p>`
    },
    {
        topic: 'Gravitation',
        content: `<h3>Core Concepts</h3>
        <p>For problems involving planets, satellites, and stars, we need to upgrade from $F_g=mg$. We turn to Newton's universal law, which describes gravity as an attractive force between any two objects with mass.</p>
        <ul>
            <li><strong>Newton's Law of Universal Gravitation:</strong> The force between two masses $m_1$ and $m_2$ separated by a distance $r$ is $F_G = G\\frac{m_1 m_2}{r^2}$. This is an inverse-square law. The constant $G$ is the universal gravitational constant.</li>
            <li><strong>Gravitational Potential Energy:</strong> For universal gravitation, the potential energy is defined to be zero at an infinite distance. This gives the formula $U_G = -G\\frac{m_1 m_2}{r}$. The negative sign is important; it signifies a bound system. It takes positive work to separate the masses.</li>
        </ul>
        <h4>Orbital Mechanics: The Dance of the Cosmos</h4>
        <p>For a satellite of mass $m$ in a stable circular orbit around a planet of mass $M$ (where $M \\gg m$):</p>
        <ol>
            <li><strong>The centripetal force is provided by gravity:</strong> $G\\frac{Mm}{r^2} = \\frac{mv^2}{r}$. You can use this to find the required orbital speed $v$ for a given radius $r$.</li>
            <li><strong>Total Energy of an Orbit:</strong> The total energy is $E = K + U = \\frac{1}{2}mv^2 - G\\frac{Mm}{r}$. By substituting $v^2$ from the force equation, we get a beautifully simple result for the total energy: $E_{orbit} = -\\frac{GMm}{2r}$. The energy of any bound orbit is negative.</li>
            <li><strong>Escape Velocity:</strong> To escape a planet's gravity, an object's total energy must be at least zero. We can find the minimum launch speed (escape velocity) by setting the final energy at $r=\\infty$ to zero: $\\frac{1}{2}mv_{esc}^2 - \\frac{GMm}{R} = 0$, which gives $v_{esc} = \\sqrt{\\frac{2GM}{R}}$.</li>
        </ol>
        <p><strong>Kepler's Laws:</strong> These describe planetary motion and are direct consequences of Newton's law.</p>
        <ul>
            <li><strong>1st Law:</strong> Planets orbit in ellipses with the Sun at one focus. (A circle is a special case of an ellipse).</li>
            <li><strong>2nd Law:</strong> A line connecting a planet to the Sun sweeps out equal areas in equal times. This is a statement of the <strong>conservation of angular momentum</strong> for an orbiting body.</li>
            <li><strong>3rd Law:</strong> The square of the orbital period is proportional to the cube of the semi-major axis ($T^2 \\propto a^3$). For circular orbits, this becomes $T^2 = \\left(\\frac{4\\pi^2}{GM}\\right)r^3$.</li>
        </ul>`
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
        if (isTimed) setTimeLeft(problems.length * 90);
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