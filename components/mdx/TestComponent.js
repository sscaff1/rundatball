export default function TestComponent({ name = 'world' }) {
  return (
    <div>
      <div>Hello, {name}!</div>
    </div>
  );
}
