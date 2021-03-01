const TRACKER_CACHE = [];
const MAX_TRACK_SIZE = 10;

export default function wrapFunctionForTrack(asyncAction) {
  const pushTrack = (meta) => {
    if (TRACKER_CACHE.length >= MAX_TRACK_SIZE) {
      TRACKER_CACHE.shift();
    }
    TRACKER_CACHE.push(meta);
  };
  return (...arg) => {
    const saveMetas = {timestamp: Date.now, input: arg, isFetching: true};
    pushTrack(saveMetas);
    try {
      return asyncAction(...arg)
        .then(res => {
          saveMetas.output = res;
          saveMetas.isFulfill = true;
          saveMetas.isFetching = false;
          return res;
        })
        .catch(ex => {
          saveMetas.output = ex;
          saveMetas.isFulfill = false;
          saveMetas.isFetching = false;
          return ex;
        });
    } catch (ex) {
      saveMetas.output = ex;
      saveMetas.abrupt = true;
      saveMetas.isFulfill = false;
      saveMetas.isFetching = false;
      throw ex;
    }
  };
}

export const getLastTrack = () => TRACKER_CACHE[TRACKER_CACHE.length - 1];
