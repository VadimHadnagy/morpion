interface Props {
  board: string[][];
  inviteCode: string;
  showCode: boolean;
  onPlay: (col: number, row: number) => void;
  topSentence: string;
  win: boolean | undefined | null;
  backToMenu: () => void;
}

export default function Morpion({
  showCode,
  inviteCode,
  board,
  onPlay,
  topSentence,
  win,
  backToMenu
}: Props) {
  return (
    <div className="morpion flex justify-center place-items-center h-full">
      {showCode && <h1>Code d'invitation : {inviteCode}</h1>}
      {!showCode && <h1>{topSentence}</h1>}
      <div className="board">
        {board.map((x, i) => {
          return <div className="cell" id={`${i}`} key={i}>
            {x.map((y, j) => {
              if (y === "" && win === null) return (
                <div key={j} onClick={() => onPlay(i, j)} className="cursor-pointer">
                  <span></span>
                </div>
              )

              return (
                <div key={j} className="cursor-default">
                  <span>{y}</span>
                </div>
              )
            })}
          </div>
        })}
      </div>
      { win !== null && <button onClick={() => backToMenu()}className="back-to-menu">Revenir au menu</button> }
    </div>
  )
}