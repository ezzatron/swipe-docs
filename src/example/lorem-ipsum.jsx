// [!section-start lorem]
export function Lorem({ ipsum, dolor }) {
  return (
    <>
      {/* [!section-start lorem-content] */}
      <Sit ipsum={ipsum} /> {/* [!section lorem-sit] */}
      {dolor}
      {/* [!section-end lorem-content] */}
    </>
  );
}
// [!section-end lorem]

function Sit({ ipsum }) {
  return <div>{ipsum}</div>;
}
