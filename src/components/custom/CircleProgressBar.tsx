import './CicleProgressBar.scss';

const CicleProgressBar = () => {
  return (
    <div className="progress-bar">
      <progress
        value={75}
        max={100}
        style={{ visibility: 'hidden', height: 0, width: 0 }}
      >
        75%
      </progress>
    </div>
  );
};

export default CicleProgressBar;
