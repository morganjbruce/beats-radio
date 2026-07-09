import('@strudel/repl').then(mod => {
  console.log('Module exports:', Object.keys(mod));
  mod.prebake().then(result => {
    console.log('prebake returned:', result);
    console.log('Type:', typeof result);
    console.log('Keys:', result ? Object.keys(result) : 'null');
    console.log('evaluate:', typeof result?.evaluate);
    console.log('stop:', typeof result?.stop);
    process.exit(0);
  }).catch(err => {
    console.error('prebake error:', err);
    process.exit(1);
  });
}).catch(err => {
  console.error('import error:', err);
  process.exit(1);
});
