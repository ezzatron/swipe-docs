const dolor = 1;
const sit = 2;
const lorem = ipsum(dolor, sit);

// !callout[/amet/] This is a callout
let amet = 0;

lorem.adipiscing((sed, elit) => {
  if (sed) {
    amet += elit;
  }
});

console.log(amet); // normal comment

function ipsum(dolor: number, sit: number) {
  return {
    adipiscing: (amet: (sed: boolean, elit: number) => void) => {
      return amet(true, dolor + sit);
    },
  };
}
