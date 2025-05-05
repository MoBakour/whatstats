import { ref } from "vue";
import { DateTime } from "luxon";
import * as whatsapp from "whatsapp-chat-parser";

export interface Message {
    sender: string;
    message: string;
    timestamp: Date;
}

export interface TimeSeriesData {
    date: string;
    count: number;
}

export function useProcess() {
    const messages = ref<Message[]>([]);

    const parseData = async (file: File): Promise<void> => {
        const rawData = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = () => reject(reader.error);
            reader.readAsText(file);
        });

        messages.value = whatsapp.parseString(rawData).map(
            (message) =>
                ({
                    sender: message.author,
                    message: message.message,
                    timestamp: message.date,
                } as Message)
        );
    };

    const getSenderFrequency = (): Record<string, number> => {
        const frequency: Record<string, number> = {};

        messages.value.forEach((message) => {
            if (frequency[message.sender]) {
                frequency[message.sender]++;
            } else {
                frequency[message.sender] = 1;
            }
        });

        return frequency;
    };

    const getTopSenders = (
        limit?: number
    ): { sender: string; count: number }[] => {
        const frequency = getSenderFrequency();
        const sortedSenders = Object.entries(frequency)
            .map(([sender, count]) => ({ sender, count }))
            .sort((a, b) => b.count - a.count);

        return limit !== undefined
            ? sortedSenders.slice(0, limit)
            : sortedSenders;
    };

    const getTimeSeriesData = (
        interval: "day" | "week" | "month" = "day"
    ): TimeSeriesData[] => {
        if (messages.value.length === 0) return [];

        // Sort messages by timestamp
        const sortedMessages = [...messages.value].sort(
            (a, b) => a.timestamp.getTime() - b.timestamp.getTime()
        );

        // Determine date format based on interval
        let dateFormat: string;
        let luxonUnit: "day" | "week" | "month";

        switch (interval) {
            case "week":
                dateFormat = "yyyy-WW";
                luxonUnit = "week";
                break;
            case "month":
                dateFormat = "yyyy-MM";
                luxonUnit = "month";
                break;
            case "day":
            default:
                dateFormat = "yyyy-MM-dd";
                luxonUnit = "day";
                break;
        }

        // Group messages by date
        const timeSeriesMap = new Map<string, number>();

        // Get the earliest and latest dates to ensure continuous time series
        const firstDate = DateTime.fromJSDate(sortedMessages[0].timestamp);
        const lastDate = DateTime.fromJSDate(
            sortedMessages[sortedMessages.length - 1].timestamp
        );

        // Initialize all dates in range with zero counts
        let currentDate = firstDate;
        while (currentDate <= lastDate) {
            timeSeriesMap.set(currentDate.toFormat(dateFormat), 0);
            currentDate = currentDate.plus({ [luxonUnit]: 1 });
        }

        // Count messages per date
        sortedMessages.forEach((message) => {
            const date = DateTime.fromJSDate(message.timestamp).toFormat(
                dateFormat
            );
            timeSeriesMap.set(date, (timeSeriesMap.get(date) || 0) + 1);
        });

        // Convert map to array
        return Array.from(timeSeriesMap.entries())
            .map(([date, count]) => ({ date, count }))
            .sort((a, b) => a.date.localeCompare(b.date));
    };

    const getMessageCountByHourOfDay = (): number[] => {
        const hourCounts = Array(24).fill(0);

        messages.value.forEach((message) => {
            const hour = message.timestamp.getHours();
            hourCounts[hour]++;
        });

        return hourCounts;
    };

    return {
        messages,
        parseData,
        getSenderFrequency,
        getTopSenders,
        getTimeSeriesData,
        getMessageCountByHourOfDay,
    };
}
