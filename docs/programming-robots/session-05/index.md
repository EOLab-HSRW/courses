# Session 5

## Visualization tools (RVIZ and others)

For the RViz part of the session, I ended up giving a more direct, hands-on explanation of the most useful panels in RViz. The main reason is that I’m not planning to write separate session notes for that section, at least not myself. Honestly, the RViz User Guide already does an excellent job of explaining how it works, so writing additional notes for RViz would mostly be redundant.

So, if you want to go back over that part of the session, just check the [RViz User Guide](https://docs.ros.org/en/humble/Tutorials/Intermediate/RViz/RViz-User-Guide/RViz-User-Guide.html).
- [PlotJuggler](https://github.com/facontidavide/PlotJuggler)
- [Foxglove](https://foxglove.dev/)
- [Rerun](https://rerun.io/). I forgot to mention this one in the session.

## Simulator (Gazebo)

[Gazebo a Naming review](https://robotics.harleylara.com/en/ros2/gazebo)

## Actions

[ROS Actions](https://robotics.harleylara.com/en/ros2/actions)

## ROS Python Client (rclpy) Documentation

You can find the official python client documentation, [rclpy](https://docs.ros.org/en/rolling/p/rclpy/#) to get all the information about the available functions that you can perform with the pythonn client.

Keep in mind the the client documentation pointing to the `rolling` distribution (the latest dev branch) and some functions may not be implemented in your distribution (e.g. Humble).

## Review RCLPY API

```python
# publisher API
pub = create_publisher(<MsgType>, "<topic_name>", <QoS>)
create_timer(<timer_rate_in_sec>, callback_timer_done)
pub.publish(<Message[MsgType]>)

# subscriber API
create_subscription(<MsgType>, "<topic_name>", callback_new_msg, <QoS>)
def callback_new_msg(new_msg): ...

# service server API
create_service(<ServiceType>, "<service_name>", callback_service_requested)

# service client API
service_client = create_client(<ServiceType>, "<service_name>")
future = service_client.call_async(<Service[ServiceType]>)
rclpy.spin_until_future_complete(<Node>, future)

# more complex API
ActionServer(<Node>, <...>)

# more complex API
ActionClient(<Node>, <...>)
```

## Launch System

[Launch System](https://robotics.harleylara.com/en/ros2/launch)

Build around the ros launch system:
- [Intrinsic Flowstate](https://www.intrinsic.ai/flowstate) a visual flow diagram to build behaviors.
- [Intrinsic Product Keynote - May 15, 2023](https://www.youtube.com/watch?v=QtSShST58io)


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

On the main page, in the [Prerequisites & Setup](../#prerequisites--setup), section, the course explicitly recommends using a native Ubuntu installation. Nevertheless, a significant number of participants still chose to use WSL2 despite the warning about reduced performance. I explained at a high level that WSL uses software rendering to display graphical applications running inside the WSL environment, which significantly affects Gazebo’s performance. In other cases, users may encounter a black screen or even some form of segmentation fault.

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


## Problems with Some Systems

- [ETHx: Self-Driving Cars with Duckietown - EdX MOOC](https://www.edx.org/learn/technology/eth-zurich-self-driving-cars-with-duckietown)
- [Let's talk about Duckietown](https://wiki.eolab.de/doku.php?id=blog:lets-talk-about-duckietown)
- [Let's Talk about Jetson Nano in 2024](https://wiki.eolab.de/doku.php?id=blog:lets-talk-about-jetson-nano-in-2024)

## External Resources - Book and more

Someone asked me whether I had any book or resource recommendations on robotics and/or ROS. I answered that I tend not to recommend any specific resource explicitly, mainly because it depends on each person’s situation and intended learning path. However, I do have a personal list of bookmarked resources that I think are worth checking out, exploring, and using to identify the sources that seem most interesting and useful to you.

[Robotics - Books Bookmarks](https://bookmarks.harleylara.com/subjects/#robotics)
