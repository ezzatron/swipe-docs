// [!section-start lorem]
export function Lorem({ ipsum, dolor }: { ipsum: number; dolor: number }) {
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

function Sit({ ipsum }: { ipsum: number }) {
  return <div>{ipsum}</div>;
}
