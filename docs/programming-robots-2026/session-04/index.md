# Session 4

## Review of ROS Report

- [2025 ROS Metrics Report ](https://discourse.openrobotics.org/t/2025-ros-metrics-report/52575)

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

ActionServer(<Node>, <...>)

ActionClient(<Node>, <...>)
```

## QoS

TBA

