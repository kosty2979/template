export const formatDuration = (
  duration,
  isVideo,
) => {
  const SECS_IN_HOUR = 3600;
  const MINS_IN_HOUR = 60;

  if (
    duration
  ) {
    const parts = [
];
    duration = Math.floor(duration,); //remove any decimal

    if (
      duration >
      SECS_IN_HOUR
    ) {
      const hourPart = Math.floor(
        duration /
          SECS_IN_HOUR);
      duration =
        duration %
        SECS_IN_HOUR;
      parts.push(hourPart,);
    }

    const minsPart = Math.floor(duration /
        MINS_IN_HOUR);

    duration =
      duration %
      MINS_IN_HOUR;
    parts.push(minsPart <
        10
        ? '0' +
            minsPart
        : minsPart,);

    //seconds
    parts.push(duration <
        10
        ? '0' +
            duration
        : duration,);
    return parts.join(':',);
  } else if (
    isVideo
  ) {
    return '00:00';
  }

  return locale.getResource('NotAvailable',);
};
