const buildPlayStreams = (arrPlayStreams) => {
  arrPlayStreams.sort((a, b) => b.bittype - a.bittype);
  let highestDefintion = arrPlayStreams.length ? arrPlayStreams[0].bittype : undefined;
  let definitions = {};
  arrPlayStreams.forEach((item) => {
    if (!definitions[item.bittype]) {
      definitions[item.bittype] = item.url;
    }
  });
  return {
    highestDefintion,
    definitions
  };
};

export {
  buildPlayStreams
};
