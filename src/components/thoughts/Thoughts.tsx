import Navigation from '../navigation/Navigation';

const Thoughts = () => {
  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: 'var(--color-bg)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem'
    }}>
      <h1 style={{ 
        fontFamily: '"Krona One", sans-serif',
        color: 'var(--color-text)',
        textAlign: 'center'
      }}>
        Thoughts Page
      </h1>
      <Navigation />
    </div>
  );
};

export default Thoughts;
