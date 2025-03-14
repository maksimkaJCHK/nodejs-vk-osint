const delayF = (delay = 400) => {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, delay);
  });
};

export default delayF;