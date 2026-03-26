# How to Parse Logs


## 1. Log Level

The first token, `Info`, is the log level. Common alternatives include `Debug`, `Warn`, and `Error`.

## 2. Timestamp

The timestamp comes next:

`2026-03-26 14:29:54.055+08:00`

This part usually includes:

- date
- time
- milliseconds
- timezone

## 3. Code Location

After the timestamp, logs usually include the source code location and machine information, for example:

`utils.go:34 10.150.52.215`

This part usually includes:

- file name and line number
- machine IP or instance address

## 4. Service and Runtime Context

Then comes this segment:

`byteview.media.schedule_test 02177450659402700000000000000000000ffff0a9634d7b6a886 default canary hl 0`

This is usually service-level context attached by the logging system. It often includes:

- service or module name
- trace id / request id / span id style identifiers
- cluster, tenant, or namespace
- environment markers such as `canary`
- zone, region, group, or shard information

The exact meaning of these fields depends on the logging platform and internal conventions.

## 5. Key-Value Context Fields

From `_podname=...` up to `_msg=`, the line is mostly composed of standardized context fields, for example:

- `_podname`
- `_ipv6`
- `__context`
- `__docid`
- `_batchid`
- `_env`
- `_env_type`
- `_language`
- `_taskname`
- `ctx_id`
- `device_id`
- `meeting_id`

This section has a few important characteristics:

- it is mostly in `key=value` form
- it is suitable for searching, filtering, and aggregation
- it helps identify which request, device, meeting, or instance this log belongs to

## 6. Core Message

After `_msg=` comes the most human-readable part of the log, for example:

`[P2P][1774506594055986230][7621440670310141156:0_0][HPGc177H]handleTimeWheelTask.DoTaskForMatch.DoMatch.Logic.To`

This part usually answers two questions:

- which business step is currently being executed
- which business object this step is handling

## 7. Detailed Parameters

After `_params=` there is usually structured JSON containing the detailed business data. In this sample, it includes:

- `combinedMeetingInfo`
- `group_infos`
- `device_info`
- `share_screen_info`
- `meeting_info_ex`

This part is commonly used for:

- reconstructing the full context
- comparing inputs and outputs
- investigating why a specific field looks abnormal

## A Simple Way to Read a Log Line

When analyzing one log line, a practical order is:

1. Check `Info/Error` first to understand the severity.
2. Check the timestamp to understand when the event happened.
3. Check file name, line number, and service name to see where the log came from.
4. Check key ids such as `ctx_id`, `meeting_id`, and `device_id` to identify the related object.
5. Check `_msg` to understand the current business action.
6. Check `_params` last to drill into the detailed data.

## Summary

In general, one log line usually contains these major parts:

1. log level
2. timestamp
3. code location
4. service and environment context
5. key-value context fields
6. core message in `_msg`
7. structured parameters in `_params`

In real troubleshooting, the most useful combination is usually `timestamp + key ids + _msg + _params`.
