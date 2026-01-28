import bcrypt from 'bcryptjs';

(async () => {
  const king = await bcrypt.hash('King1000$', 10);
  const demo = await bcrypt.hash('demo1234', 10);
  
  console.log('King1000$ hash:', king);
  console.log('demo1234 hash:', demo);
})();
