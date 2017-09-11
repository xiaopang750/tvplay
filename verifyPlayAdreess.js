export default (checkRule, result) => {
  let checkResult = true;
  if (result.singleVideoDefintions) {
    let {singleVideoDefintions: {definitions: singleVideoDefintions, highestDefintion: highestSin}} = result;
    let singleHighestVideo = singleVideoDefintions[highestSin];
    let {result: checkSingle} = checkRule(singleHighestVideo);
    if (!checkSingle) {
      checkResult = false;
    }
  }
  if (result.multiVideoDefintions) {
    let {multiVideoDefintions: {definitions: multiVideoDefintions, highestDefintion: highestMulti}} = result;
    let multiHighestVideos = multiVideoDefintions[highestMulti];
    multiHighestVideos.forEach(({url}) => {
      let {result: checkMulti} = checkRule(url);
      if (!checkMulti) checkResult = checkMulti;
    });
  }
  return checkResult;
};
