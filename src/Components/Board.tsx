import { useEffect, useMemo, useState } from "react";
import { EventsServerData, Events } from "../../server/src/Interface/Events"
import FourPow from "./Boards/FourPow";
import Morpion from "./Boards/Morpion";

export interface BoardProps {
    url: string;
    game: "morpion" | "4pow";
    invitePropsCode: string;
    userType: "creator" | "invite";
    ws: WebSocket;
    token: string;
    setInRoom: (value: boolean) => void; 
}

let token: string;

export default function Board ({ 
    url,
    game, 
    invitePropsCode,
    userType,
    ws,
    token,
    setInRoom
}: BoardProps) {
    const [gameType, setGameType] = useState(game)

    let baseBoard = useMemo(() => {
        if (gameType === "morpion") return [...Array(3)].map(x => [...Array(3)].fill(""))
        else if (gameType === "4pow") return [...Array(3)].map(x => [...Array(3)].fill(""))

        return [...Array(3)].map(x => [...Array(3)].fill(""))
        // return [
        //     ["x", "o", "x"],
        //     ["o", "x", "o"],
        //     ["o", "o", "o"]
        // ]
    }, [gameType])

    const [board, setBoard] = useState<string[][]>(baseBoard)
    const [inviteCode, setInviteCode] = useState(invitePropsCode)
    const [inviteJoin, setInviteJoin] = useState(false)
    const [whoStart, setWhoStart] = useState<number>()
    const [count, setCounter] = useState(0)
    const [showCode, setShowCode] = useState(userType === "creator")
    const [win, setWin] = useState<boolean | undefined | null>(null)

    let [topSentence, wichTurn] = useMemo(() => {
        if (win !== null) {
            if (win === undefined) return ["Vous avez fait égalité"]
            else if (win) return ["Vous avez gagné"] 
            else if (!win) return ["Vous avez perdu"]
        }

        if (count % 2 === whoStart) {
            switch (userType) {
                case "invite":
                    return ["Votre tour", "invite"]
            
                case "creator":
                    return ["Tour de l'autre joueur", "invite"]
            }
        } else {
            switch (userType) {
                case "creator":
                    return ["Votre tour", "creator"]
            
                case "invite":
                    return ["Tour de l'autre joueur", "creator"]
            }
        }
    }, [count, win, whoStart])

    function onPlay (col: number, row: number) {
        console.log(col, row);

        if (ws === undefined) return
        if (!inviteJoin) return

        if (wichTurn !== userType) return

        console.log("play");
        
        ws.send(JSON.stringify({
            token,
            event: Events.MORPION_PLAY,
            data: {
                col,
                row
            }
        }))
    }

    useEffect(() => {
        ws.onmessage = (msg) => {
            try {
                let { event, data }: {
                    event: keyof EventsServerData,
                    data: EventsServerData[Events]
                } = JSON.parse(msg.data)

                console.log(data);

                switch (event) {
                    case Events.CREATE_ROOM:
                        data = data as EventsServerData[typeof event]

                        setInviteCode(data.inviteCode)
                        break

                    case Events.JOIN_ROOM:
                        data = data as EventsServerData[typeof event]

                        setInviteJoin(true)

                        if (userType === "invite") setGameType(data.game)

                        setWhoStart(data.whoStart)
                        setShowCode(false)
                        break

                    case Events.MORPION_PLAY:
                        data = data as EventsServerData[typeof event]
                        
                        setCounter((count) => count + 1)
                        setBoard(data.board)
                        break

                    case Events.MORPION_FINISH:
                        data = data as EventsServerData[typeof event]

                        setBoard(data.board)
                        setWin(() => (data as any).win)
                        break

                    default:
                        break;
                }
            } catch (error) {
                console.log(error);
            }
        }

        return () => {
            console.count("board render");

            ws.onmessage = () => {}
        }
    }, [])

    function backToMenu () {
        ws.onmessage = () => {}

        setInRoom(false)
    }

    if (gameType === "morpion") return (
        <Morpion
            onPlay={onPlay}
            inviteCode={inviteCode}
            topSentence={topSentence}
            board={board}
            showCode={showCode}
            win={win}
            backToMenu={backToMenu}
        />
    )
    else if (gameType === "4pow") return <FourPow />
    else return <div>Chargement</div>
}