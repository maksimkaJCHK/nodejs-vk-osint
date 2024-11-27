const delayF = (delay = 1_000) => {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, delay);
  });
};

export default delayF;