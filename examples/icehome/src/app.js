App({
  onLaunch: async function() {
    const a = {};

    console.log(a?.b);

    function test(param = throw new Error('required!')) {
      const test = param === true || throw new Error('Falsey!');
    }

    let budget = 1_000_000_000_000;
  }
});
