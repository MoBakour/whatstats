import { ref } from "vue";
import { DateTime } from "luxon";
import * as whatsapp from "whatsapp-chat-parser";
import { unzip } from "fflate";
import type { Message, TimeSeriesData, TimeInterval } from "../utils/constants";

export function useProcess() {
    const messages = ref<Message[]>([]);
    const isProcessing = ref<boolean>(false);
    const processingError = ref<string | null>(null);

    const parseData = async (file: File): Promise<void> => {
        isProcessing.value = true;
        processingError.value = null;

        try {
            let rawData: string;

            // Check if the file is a zip file
            if (file.type === "application/zip" || file.name.endsWith(".zip")) {
                rawData = await extractChatFromZip(file);
            } else {
                // Regular text file processing
                rawData = await readFileAsText(file);
            }

            let parsed = whatsapp.parseString(rawData).map(
                (message) =>
                    ({
                        sender: message.author?.trim(),
                        message: message.message,
                        timestamp: message.date,
                    } as Message)
            );

            const groupName = parsed[0]?.sender;

            // Remove messages from the group name and "You"
            parsed = parsed.filter((msg) => {
                return msg.sender && ![groupName, "‎You"].includes(msg.sender);
            });

            messages.value = parsed;
        } catch (error) {
            processingError.value =
                error instanceof Error
                    ? error.message
                    : "Unknown error processing file";
            console.error("Error processing file:", error);
        } finally {
            isProcessing.value = false;
        }
    };

    // Helper function to read file as text
    const readFileAsText = (file: File): Promise<string> => {
        return new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = () => reject(reader.error);
            reader.readAsText(file);
        });
    };

    // Helper function to extract _chat.txt from a zip file
    const extractChatFromZip = async (zipFile: File): Promise<string> => {
        return new Promise<string>((resolve, reject) => {
            // Convert the File to an ArrayBuffer
            const reader = new FileReader();
            reader.onload = async (event) => {
                if (!event.target?.result) {
                    reject(new Error("Failed to read zip file"));
                    return;
                }

                const data = event.target.result as ArrayBuffer;

                // Process the zip file
                unzip(
                    new Uint8Array(data),
                    {
                        filter(file) {
                            // Look for _chat.txt or any text file that might contain chats
                            return (
                                file.name.includes("_chat.txt") ||
                                file.name.endsWith(".txt")
                            );
                        },
                    },
                    (err, unzipped) => {
                        if (err) {
                            reject(
                                new Error(
                                    `Failed to unzip file: ${err.message}`
                                )
                            );
                            return;
                        }

                        // Find _chat.txt file
                        const chatFileName = Object.keys(unzipped).find(
                            (name) =>
                                name.includes("_chat.txt") ||
                                name.endsWith(".txt")
                        );

                        if (!chatFileName || !unzipped[chatFileName]) {
                            reject(
                                new Error(
                                    "No chat file found in the zip archive"
                                )
                            );
                            return;
                        }

                        // Convert the Uint8Array to a string
                        const decoder = new TextDecoder("utf-8");
                        const chatContent = decoder.decode(
                            unzipped[chatFileName]
                        );
                        resolve(chatContent);
                    }
                );
            };

            reader.onerror = () =>
                reject(reader.error || new Error("Failed to read zip file"));
            reader.readAsArrayBuffer(zipFile);
        });
    };

    const getSenderFrequency = () => {
        const frequency: Record<string, number> = {};

        messages.value.forEach((message) => {
            if (frequency[message.sender]) {
                frequency[message.sender]++;
            } else {
                frequency[message.sender] = 1;
            }
        });

        return Object.entries(frequency).sort(([, a], [, b]) => b - a);
    };

    const getTopSenders = (
        limit?: number
    ): { sender: string; count: number }[] => {
        const frequency = getSenderFrequency();
        const sortedSenders = frequency
            .map(([sender, count]) => ({ sender, count }))
            .sort((a, b) => b.count - a.count);

        return limit !== undefined
            ? sortedSenders.slice(0, limit)
            : sortedSenders;
    };

    const getTimeSeriesData = (
        interval: TimeInterval = "month",
        sender: string | null = null
    ): TimeSeriesData[] => {
        let msgs = [...messages.value];
        if (msgs.length === 0) return [];

        if (sender) {
            msgs = msgs.filter((message) => message.sender === sender);
        }

        // Sort messages by timestamp
        const sortedMessages = msgs.sort(
            (a, b) => a.timestamp.getTime() - b.timestamp.getTime()
        );

        // Determine date format based on interval
        let dateFormat: string;
        let luxonUnit: TimeInterval;

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

        // Get current date and exclude current period
        const now = DateTime.now();
        const currentPeriod = now.toFormat(dateFormat);

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
            const formattedDate = currentDate.toFormat(dateFormat);
            // Skip current period
            if (formattedDate !== currentPeriod) {
                timeSeriesMap.set(formattedDate, 0);
            }
            currentDate = currentDate.plus({ [luxonUnit]: 1 });
        }

        // Count messages per date
        sortedMessages.forEach((message) => {
            const date = DateTime.fromJSDate(message.timestamp).toFormat(
                dateFormat
            );
            // Skip current period
            if (date !== currentPeriod) {
                timeSeriesMap.set(date, (timeSeriesMap.get(date) || 0) + 1);
            }
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
        isProcessing,
        processingError,
    };
}
