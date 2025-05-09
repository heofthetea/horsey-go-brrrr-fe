//TODO mock-implementation - finalize

const mock_games = [
    {
        id: "game1",
        jen: "004003o-xox--xo----",
        start_time: "2024-05-01T12:00:00Z",
        end_time: null,
    },
    {
        id: "game2",
        jen: "009009xx-o------x-o------x-o------------------------------------------------------------",
        start_time: "2024-04-25T10:00:00Z",
        end_time: "2024-04-25T11:00:00Z",
    },
];

export async function get_games_by_user(user_id) {
    console.log("get_games_by_user", user_id);
    return mock_games;
}
