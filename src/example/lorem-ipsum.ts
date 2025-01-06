const dolor = 1;
const sit = 2;
const lorem = ipsum(dolor, sit);

let amet = 0;

lorem.adipiscing((sed, elit) => {
  if (sed) {
    // [!code focus]
    amet += elit;
  }
});

console.log(amet); // normal comment

// [!code focus:7]
function ipsum(dolor: number, sit: number) {
  return {
    adipiscing: (amet: (sed: boolean, elit: number) => void) => {
      return amet(true, dolor + sit);
    },
  };
}

// hullo
