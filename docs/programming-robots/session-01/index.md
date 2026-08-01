# Session 1

## Survey

[Survey -  Programming Robots, Spring Bootcamp](https://hochschule-rhein-waal.sciebo.de/apps/forms/embed/aEkmtMXDtjBwoXRDqjrbsZo5)

## Who are we

[Earth Observation Lab (EOLab)](https://eolab.de) is an educational, innovation laboratory dedicated to environmental science and technology at the Rhine-Waal University of Applied Sciences, Kamp-Lintfort campus. Founded in 2020 by [Dr. Rolf Becker](https://www.hochschule-rhein-waal.de/en/user/7254), it is a culmination of three labs (Formerly known as [Lab3](https://www.hochschule-rhein-waal.de/en/faculties/communication-and-environment/laboratories/lab3)) - DroneLab, IoTLab (Internet of Things Lab) and EOLab.

## Why are we doing this

Because there’s no reason not to.

## Our Assumptions

To make the most of this bootcamp, we assume participants arrive with a solid set of foundational skills. In particular, we assume you have the following background:
- You are familiar with Ubuntu's desktop environment and can navigate it confidently.
- *You are comfortable working in a terminal (primarily bash) and can use common commands for navigating, inspecting, and manipulating files and directories.
- You understand the basics of the GNU/Linux filesystem layout and concepts such as absolute vs. relative paths, permissions at a basic level, and standard directory structure.
- \*\*You have working skills in Python and/or C++, including basic programming fluency (variables, control flow, functions) and core object-oriented programming (OOP) concepts (classes/objects, methods, encapsulation—at least at an introductory level).
- You have basic familiarity with git and version control workflows (cloning, committing, branching at a basic level).

\*Note: We intend to do a short, fast review of Linux and the command line early on to align everyone on the basics.

\*\*Note: We can also do a brief OOP refresher, but only if necessary (for example, if gaps start to slow down the ROS-focused parts of the bootcamp).

## What to Expect 

By the end of the bootcamp, participants should feel confident programming robots with ROS. You will be able to implement basic robot functionalities and control behaviors in both simulation and (when available) on real hardware.

More importantly, you should leave with a solid understanding of ROS concepts and workflow, enough to independently navigate documentation, read source code, and make effective use of external resources when working with ROS-based robots.

## What Not to Expect

Video recordings of the sessions. This is intentional, please see the section [Intended Approach (Methodology)](#intended-approach-methodology) for the rationale and how session notes are provided instead.

A full "build a robot from scratch" experience. Developing a complete robot system; mechanical design, electronics, hardware integration, extensive testing, reliability engineering, and long-term iteration, is a substantially larger undertaking than can be covered within the bootcamp's time constraints. The bootcamp focuses on giving you the ROS foundation and practical workflow you need to contribute to such projects afterward.

## Intended Approach (Methodology)

**Shared pace**: We’ll move through the material at a shared pace, making sure everyone has time to follow along and keep up with the core ideas.

**Interactive**: The sessions are designed to be dynamic and interactive, you can ask questions at any time, and we’ll adjust when something needs clarification or a deeper look.

**Write code**: You’re encouraged to write the code yourself as you learn. This helps you build real fluency and confidence, so whenever possible, avoid copy-pasting and focus on **understanding each step**.

Importantly, the session notes are intentionally compiled and added at the end of each session. This is by design: it keeps the live session focused and interactive, while still ensuring you leave with a complete, structured reference you can rely on later.

After the session (for example, at home), you should be able to reproduce everything at your own pace using the session notes. This is an intentionally efficient way to capture the session compared to video: text is faster to scan, easy to index, and fully searchable. In practice, you can often review a session’s notes in about 30 minutes, whereas rewatching the in-class, step-by-step version is typically much slower and more verbose.

**In-class questions** may or may not appear in the session notes. Whether a question is included is at the instructor’s discretion. If a question leads to a broadly useful clarification, it may be captured in the final notes; if it’s more personal or context-specific, it may not. In those cases, learners are encouraged to keep their own personal notes for the details most relevant to them.

## Whirlwind Tour - Linux Commands

[Linux Cheat Sheet](https://robotics.harleylara.com/en/ros2/linux-cheat-sheet).

## Introduction to ROS

Small activity: Write **on a piece of paper** the schema/format you would propose to encode, transport or store the readings of a 2D LiDAR sensor, see [example image of the operation mode](https://robotcopper.github.io/config/assets/images/Synthetic2DLidarScanGenerator/plot.png).


[ROS Introduction](https://robotics.harleylara.com/en/ros2/intro)

## Install ROS

[Ubuntu (deb packages)](https://docs.ros.org/en/humble/Installation/Ubuntu-Install-Debs.html)

## ROS Workspace

[ROS Workspace](https://robotics.harleylara.com/en/ros2/ws)

## ROS Packages

[ROS Packages](https://robotics.harleylara.com/en/ros2/pkgs)
