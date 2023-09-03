'use client';

const error = ({ error, reset }: { error: Error; reset: () => void }) => {
  return (
    <div>
      <button onClick={reset}></button> error
    </div>
  );
};

export default error;
