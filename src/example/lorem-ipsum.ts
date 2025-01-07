const dolor = 1;
const sit = 2;
const lorem = ipsum(dolor, sit);

let amet = 0;

lorem.adipiscing((sed, elit) => {
  if (sed) amet += elit;
});

console.log(amet); // normal comment

// [!section-start ipsum]
function ipsum(dolor: number, sit: number) {
  return {
    // [!section-start ipsum-adipiscing] [\!section-start ipsum-adipiscing]
    adipiscing: (amet: (sed: boolean, elit: number) => void) => {
      return amet(true, dolor + sit); // [!section ipsum-adipiscing-return]
    },
    // [!section-end ipsum-adipiscing] [\!section-end ipsum-adipiscing]
  };
}
// [!section-end ipsum]

// hullo
