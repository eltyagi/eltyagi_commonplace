import './PageLoader.css';

const bushidoVirtues = [
  { kanji: '義', romaji: 'Gi' },
  { kanji: '勇', romaji: 'Yū' },
  { kanji: '仁', romaji: 'Jin' },
  { kanji: '礼', romaji: 'Rei' },
  { kanji: '誠', romaji: 'Makoto' },
  { kanji: '名誉', romaji: 'Meiyo' },
  { kanji: '忠義', romaji: 'Chūgi' }
];

export const PageLoader = () => (
  <div className="page-loader">
    <div className="bushido-container">
      {bushidoVirtues.map((virtue, index) => (
        <div 
          key={index} 
          className="bushido-virtue"
          style={{ animationDelay: `${index * 0.4}s` }}
        >
          <span className="kanji">{virtue.kanji}</span>
        </div>
      ))}
    </div>
  </div>
);
