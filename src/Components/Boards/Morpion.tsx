interface Props {
  board: string[][];
  inviteCode: string;
  showCode: boolean;
  onPlay: (col: number, row: number) => void;
  topSentence: string;
}

export default function Morpion({
  showCode,
  inviteCode,
  board,
  onPlay,
  topSentence
}: Props) {
  return (
    <div className="morpion flex justify-center place-items-center h-full">
      {showCode && <h1>Code d'invitation : {inviteCode}</h1>}
      {!showCode && <h1>{topSentence}</h1>}
      <div className="board">
        {board.map((x, i) => {
          return <div className="cell" key={i}>
            {x.map((y, j) => {
              if (y === "") return (
                <div onClick={() => onPlay(i, j)} className="cursor-pointer">
                  <span key={j}></span>
                </div>
              )

              return (
                <div className="cursor-default">
                  <span key={j}>{y}</span>
                </div>
              )
            })}
          </div>
        })}
      </div>
    </div>
  )
}