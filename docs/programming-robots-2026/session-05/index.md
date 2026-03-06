# Session 5

## Warm-up Task: Controlling a Turtle with your Keyboard

Start a turtle using turtlesim:

```
ros2 run turtlesim turtlesim_node
```

Now we want to use the node `teleop_twist_keyboard` from the package [`teleop_twist_keyboard`](https://index.ros.org/p/teleop_twist_keyboard/#humble). **Your task** is: Using `teleop_twist_keyboard` move the turtle using your keyboard.

## Launch System

TBA

## Visualization tools (RVIZ and others)

TBA

## Simulator (Gazebo)

TBA

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
