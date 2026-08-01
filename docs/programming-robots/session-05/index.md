# Session 5

## Warm-up Task: Controlling a Turtle with your Keyboard

Start a turtle using turtlesim:

```
ros2 run turtlesim turtlesim_node
```

Now we want to use the node `teleop_twist_keyboard` from the package [`teleop_twist_keyboard`](https://index.ros.org/p/teleop_twist_keyboard/#humble). **Your task** is: Using `teleop_twist_keyboard` move the turtle using your keyboard.

## Launch System

TBA
- [Intrinsic Flowstate](https://www.intrinsic.ai/flowstate) a visual flow diagram to build behaviors.
- [Intrinsic Product Keynote - May 15, 2023](https://www.youtube.com/watch?v=QtSShST58io)

## Visualization tools (RVIZ and others)

For the RViz part of the session, I ended up giving a more direct, hands-on explanation of the most useful panels in RViz. The main reason is that I’m not planning to write separate session notes for that section, at least not myself. Honestly, the RViz User Guide already does an excellent job of explaining how it works, so writing additional notes for RViz would mostly be redundant.

So, if you want to go back over that part of the session, just check the [RViz User Guide](https://docs.ros.org/en/humble/Tutorials/Intermediate/RViz/RViz-User-Guide/RViz-User-Guide.html).

- [PlotJuggler](https://github.com/facontidavide/PlotJuggler)
- [Foxglove](https://foxglove.dev/)
- [Rerun](https://rerun.io/). I forgot to mention this one in the session.

## Simulator (Gazebo)

TBA

### Install Gz Harmonic + Humble

```bash
sudo apt remove ignition* ros-humble-ros-ign* && sudo apt autoremove

sudo apt-get update
sudo apt-get install curl lsb-release gnupg

sudo curl https://packages.osrfoundation.org/gazebo.gpg --output /usr/share/keyrings/pkgs-osrf-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/pkgs-osrf-archive-keyring.gpg] https://packages.osrfoundation.org/gazebo/ubuntu-stable $(lsb_release -cs) main" | sudo tee /etc/apt/sources.list.d/gazebo-stable.list > /dev/null
sudo apt-get update

sudo apt-get install ros-humble-ros-gzharmonic
```

Source: [Binary Installation on Ubuntu](https://gazebosim.org/docs/harmonic/install_ubuntu/#binary-installation-on-ubuntu)

### WSL - Fix Slow Perfomance on NVIDIA GPUs

On the main page, in the [Prerequisites & Setup](/programming-robots-2026/#prerequisites--setup), section, the course explicitly recommends using a native Ubuntu installation. Nevertheless, a significant number of participants still chose to use WSL2 despite the warning about reduced performance. I explained at a high level that WSL uses software rendering to display graphical applications running inside the WSL environment, which significantly affects Gazebo’s performance. In other cases, users may encounter a black screen or even some form of segmentation fault.

The current patch applies only to NVIDIA GPUs. This problem is a known issue, [Windows 11 WSLg Gazebo Black Screen](https://github.com/gazebosim/gz-sim/issues/2670#issuecomment-2952642374), and it is related to the [Mesa driver](https://gitlab.freedesktop.org/mesa/mesa/-/issues/12294). 

You need to update your mesa driver to 25.0.+, to resolve it, you need to run the following commands:

```
sudo add-apt-repository ppa:kisak/turtle
sudo apt update && sudo apt dist-upgrade
sudo apt install mesa-utils
```

Add the following environment variables to your `.bashrc`:
```
export GALLIUM_DRIVER=d3d12
export MESA_D3D12_DEFAULT_ADAPTER_NAME=NVIDIA
```

Source your `.bashr` or slose and open a new terminal, and check your current device:
```
glxinfo | grep Device:
```

It should print something like:
```
Device: D3D12 (NVIDIA GeForce RTX 4060 Laptop GPU) (0xffffffff)
```

## Robots

During the live session, someone asked for recommendations for low-cost robots. I explained that robots are generally still expensive for students and for personal acquisition, but I presented some of the more affordable options I am familiar with.

List of robot (These are not explicit recommendations in favor of anything.)
- [Duckiebot (DB-J) (version 2021)](https://get.duckietown.com/products/duckiebot-db21?variant=45917225451695)
- [ROSbot 2 by Husarion](https://husarion.com/tutorials/howtostart/rosbot---quick-start/) (ROSbot 2 has reached end-of-life status as of August 31, 2023.)
- [ROSbot 3 by Husarion](https://store.husarion.com/products/rosbot-3)
- [TurtleBot 4 Lite or Pro by ClearpathRobotics](https://www.mybotshop.de/TurtleBot-4-Lite)
- [nanosaur - Open Source Designed & made by Raffaello Bonghi](https://nanosaur.ai/)
- [Collection of ROS Robots by Hiwonder](https://www.hiwonder.com/collections/ros-robot)

## Problems with Some Systems

- [ETHx: Self-Driving Cars with Duckietown - EdX MOOC](https://www.edx.org/learn/technology/eth-zurich-self-driving-cars-with-duckietown)
- [Let's talk about Duckietown](https://wiki.eolab.de/doku.php?id=blog:lets-talk-about-duckietown)
- [Let's Talk about Jetson Nano in 2024](https://wiki.eolab.de/doku.php?id=blog:lets-talk-about-jetson-nano-in-2024)

## External Resources - Book and more

Someone asked me whether I had any book or resource recommendations on robotics and/or ROS. I answered that I tend not to recommend any specific resource explicitly, mainly because it depends on each person’s situation and intended learning path. However, I do have a personal list of bookmarked resources that I think are worth checking out, exploring, and using to identify the sources that seem most interesting and useful to you.

[Robotics - Books Bookmarks](https://bookmarks.harleylara.com/subjects/#robotics)
