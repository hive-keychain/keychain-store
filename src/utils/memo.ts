export const generateMemo = (size = 20) => {
  let result = '';
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < size) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));

    counter += 1;
    if (counter % 4 === 0 && counter !== size) {
      result += '-';
    }
  }
  return result;
};
