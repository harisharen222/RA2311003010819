export const scheduleVehicles = (vehicles, maxHours) => {
    const n = vehicles.length;

    // DP table
    const dp = Array(n + 1)
        .fill()
        .map(() => Array(maxHours + 1).fill(0));

    // Build table
    for (let i = 1; i <= n; i++) {
        const { Duration, Impact } = vehicles[i - 1];

        for (let w = 0; w <= maxHours; w++) {
            if (Duration <= w) {
                dp[i][w] = Math.max(
                    Impact + dp[i - 1][w - Duration],
                    dp[i - 1][w]
                );
            } else {
                dp[i][w] = dp[i - 1][w];
            }
        }
    }

    // Backtrack to find selected vehicles
    let w = maxHours;
    const selected = [];

    for (let i = n; i > 0; i--) {
        if (dp[i][w] !== dp[i - 1][w]) {
            selected.push(vehicles[i - 1]);
            w -= vehicles[i - 1].Duration;
        }
    }

    return selected;
};