# Session 5

## Warm-up Task: Controlling a Turtle with your Keyboard

Start a turtle using turtlesim:

```
ros2 run turtlesim turtlesim_node
```

Now we want to use the node `teleop_twist_keyboard` from the package [`teleop_twist_keyboard`](https://index.ros.org/p/teleop_twist_keyboard/#humble). **Your task** is: Using `teleop_twist_keyboard` move the turtle using your keyboard.

## Launch System

TBA
- [Intrinsic Product Keynote - May 15, 2023](https://www.youtube.com/watch?v=QtSShST58io)

## Visualization tools (RVIZ and others)

TBA

- [PlotJuggler](https://github.com/facontidavide/PlotJuggler)
- [Foxglove](https://foxglove.dev/)

## Simulator (Gazebo)

TBA

## Robots

This are (I'm not recomending any explicity in favor)
- [Duckiebot (DB-J) (version 2021)](https://get.duckietown.com/products/duckiebot-db21?variant=45917225451695)
- [ROSbot 2 by Husarion](https://husarion.com/tutorials/howtostart/rosbot---quick-start/) (ROSbot 2 has reached end-of-life status as of August 31, 2023.)
- [ROSbot 3 by Husarion](https://store.husarion.com/products/rosbot-3)
- [TurtleBot 4 Lite or Pro by ClearpathRobotics](https://www.mybotshop.de/TurtleBot-4-Lite)
- [nanosaur - Open Source Designed & made by Raffaello Bonghi](https://nanosaur.ai/)

## The Problem with Some System

- [ETHx: Self-Driving Cars with Duckietown - EdX MOOC](https://www.edx.org/learn/technology/eth-zurich-self-driving-cars-with-duckietown)
- [Let's talk about Duckietown](https://wiki.eolab.de/doku.php?id=blog:lets-talk-about-duckietown)
- [Let's Talk about Jetson Nano in 2024](https://wiki.eolab.de/doku.php?id=blog:lets-talk-about-jetson-nano-in-2024)

## WSL People Situation

## Gz Harmonic with Humble

```bash
sudo apt remove ignition* ros-humble-ros-ign* && sudo apt autoremove

sudo apt-get update
sudo apt-get install curl lsb-release gnupg

sudo curl https://packages.osrfoundation.org/gazebo.gpg --output /usr/share/keyrings/pkgs-osrf-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/pkgs-osrf-archive-keyring.gpg] https://packages.osrfoundation.org/gazebo/ubuntu-stable $(lsb_release -cs) main" | sudo tee /etc/apt/sources.list.d/gazebo-stable.list > /dev/null
sudo apt-get update

sudo apt-get install ros-humble-gz-harmonic
```

Source: [Binary Installation on Ubuntu](https://gazebosim.org/docs/harmonic/install_ubuntu/#binary-installation-on-ubuntu)

## External Resources - Book and more

[Robotics - Books Bookmarks](https://bookmarks.harleylara.com/subjects/#robotics)
