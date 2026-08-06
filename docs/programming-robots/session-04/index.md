# Session 4

## QoS

[ROS QoS](https://robotics.harleylara.com/en/ros2/qos)

## Arguments, ROS arguments and Node Parameters

[Arguments, ROS Arguments and Node Parameters](https://robotics.harleylara.com/en/ros2/parameters)

## Actions

[ROS Actions](https://robotics.harleylara.com/en/ros2/actions-)

## ROS Python Client (rclpy) Documentation

You can find the official python client documentation, [rclpy](https://docs.ros.org/en/rolling/p/rclpy/#) to get all the information about the available functions that you can perform with the pythonn client.

Keep in mind the the client documentation pointing to the `rolling` distribution (the latest dev branch) and some functions may not be implemented in your distribution (e.g. Humble).

## Task - Complete the Action Client

In session 03 we started writing our own Action Server using our `DriveDistence` interface. Now, to test your knowledge you are asked to **write the action client** using the Official ROS Documentation, [Writing an action server and client (Python)](https://docs.ros.org/en/humble/Tutorials/Intermediate/Writing-an-Action-Server-Client/Py.html), this puts you in a more realistic setting.

Your task: read the Official tutorial, and use it as baseline to write your own action client using your own `DriveDistence` interface.

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
