import GetSessionsByMonth from '@/api/getSessionsByMonth';
import SessionCard from '@/components/sessionCard';
import { useUser } from '@/components/userContext';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useMemo, useState } from 'react';
import {
    ActivityIndicator,
    Pressable,
    RefreshControl,
    ScrollView,
    Text,
    View,
} from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

const DAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const MONTHS = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
];

export default function CalendarScreen() {
    const { token } = useUser();
    const today = new Date();

    const [year, setYear] = useState(today.getFullYear());
    const [month, setMonth] = useState(today.getMonth() + 1); // 1-indexed
    const [sessions, setSessions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [selectedDate, setSelectedDate] = useState<number | null>(today.getDate());

    const opacity = useSharedValue(0);
    const animStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

    // Fetch sessions for current month view
    const fetchSessions = async () => {
        if (!token) return;
        const data = await GetSessionsByMonth(token, year, month);
        setSessions(data || []);
        opacity.value = 0;
        opacity.value = withTiming(1, { duration: 300 });
    };

    const loadMonthSessions = async () => {
        setLoading(true);
        await fetchSessions();
        setLoading(false);
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchSessions();
        setRefreshing(false);
    };

    useEffect(() => {
        loadMonthSessions();
        setSelectedDate(
            year === today.getFullYear() && month === today.getMonth() + 1
                ? today.getDate()
                : null
        );
    }, [year, month, token]);

    // Build a Set of day-numbers that have sessions this month
    const workoutDays = useMemo(() => {
        const days = new Set<number>();
        sessions.forEach((item: any) => {
            const d = new Date(item?.session?.start_time);
            days.add(d.getDate());
        });
        return days;
    }, [sessions]);

    // Sessions for the selected date
    const selectedSessions = useMemo(() => {
        if (selectedDate === null) return [];
        return sessions.filter((item: any) => {
            const d = new Date(item?.session?.start_time);
            return d.getDate() === selectedDate;
        });
    }, [sessions, selectedDate]);

    // Calendar grid: first day of month offset
    const firstDayOfMonth = new Date(year, month - 1, 1).getDay(); // 0=Sun
    const daysInMonth = new Date(year, month, 0).getDate();

    const prevMonth = () => {
        if (month === 1) { setMonth(12); setYear(y => y - 1); }
        else setMonth(m => m - 1);
    };
    const nextMonth = () => {
        if (month === 12) { setMonth(1); setYear(y => y + 1); }
        else setMonth(m => m + 1);
    };

    const isToday = (day: number) =>
        day === today.getDate() && month === today.getMonth() + 1 && year === today.getFullYear();

    return (
        <View style={{ flex: 1, backgroundColor: '#070F18', paddingTop: 56 }}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 110 }}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        tintColor="#F8C61E"
                        title="Updating..."
                        titleColor="#F8C61E"
                        colors={["#F8C61E"]}
                        progressBackgroundColor="#151C26"
                    />
                }
            >
                {/* Header */}
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                    <Text style={{ fontSize: 24, fontWeight: '700', color: '#DCE3F1' }}>
                        Workout Calendar
                    </Text>
                </View>

                {/* Calendar Card */}
                <LinearGradient
                    colors={['rgba(248,198,30,0.06)', 'rgba(248,198,30,0)']}
                    start={{ x: 0.5, y: 0 }}
                    end={{ x: 0.5, y: 1 }}
                    style={{ borderRadius: 20, marginBottom: 16 }}
                >
                    <View style={{
                        borderWidth: 1,
                        borderColor: 'rgba(78,70,51,0.5)',
                        borderRadius: 20,
                        padding: 16,
                    }}>
                        {/* Month Navigator */}
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                            <Pressable
                                onPress={prevMonth}
                                style={{ padding: 8 }}
                            >
                                <Text style={{ color: '#F8C61E', fontSize: 20, fontWeight: '700' }}>‹</Text>
                            </Pressable>
                            <Text style={{ color: '#DCE3F1', fontSize: 18, fontWeight: '700' }}>
                                {MONTHS[month - 1]} {year}
                            </Text>
                            <Pressable
                                onPress={nextMonth}
                                style={{ padding: 8 }}
                            >
                                <Text style={{ color: '#F8C61E', fontSize: 20, fontWeight: '700' }}>›</Text>
                            </Pressable>
                        </View>

                        {/* Day headers */}
                        <View style={{ flexDirection: 'row', marginBottom: 8 }}>
                            {DAYS.map((d, i) => (
                                <View key={i} style={{ flex: 1, alignItems: 'center' }}>
                                    <Text style={{ color: '#9AA4B2', fontSize: 12, fontWeight: '600' }}>{d}</Text>
                                </View>
                            ))}
                        </View>

                        {/* Calendar grid */}
                        {loading ? (
                            <View style={{ height: 160, alignItems: 'center', justifyContent: 'center' }}>
                                <ActivityIndicator size="small" color="#F8C61E" />
                            </View>
                        ) : (
                            <Animated.View style={animStyle}>
                                {Array.from({ length: Math.ceil((firstDayOfMonth + daysInMonth) / 7) }, (_, weekIdx) => (
                                    <View key={weekIdx} style={{ flexDirection: 'row', marginBottom: 6 }}>
                                        {Array.from({ length: 7 }, (_, dayIdx) => {
                                            const day = weekIdx * 7 + dayIdx - firstDayOfMonth + 1;
                                            const valid = day >= 1 && day <= daysInMonth;
                                            const hasWorkout = valid && workoutDays.has(day);
                                            const isSelected = valid && selectedDate === day;
                                            const todayDay = valid && isToday(day);

                                            return (
                                                <Pressable
                                                    key={dayIdx}
                                                    onPress={() => valid ? setSelectedDate(day) : null}
                                                    style={{ flex: 1, alignItems: 'center', paddingVertical: 4 }}
                                                >
                                                    <View style={{
                                                        width: 36,
                                                        height: 36,
                                                        borderRadius: 10,
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        backgroundColor: hasWorkout
                                                            ? isSelected
                                                                ? '#F8C61E'
                                                                : 'rgba(248,198,30,0.18)'
                                                            : isSelected
                                                                ? 'rgba(255,255,255,0.1)'
                                                                : 'transparent',
                                                        borderWidth: todayDay && !isSelected ? 1 : 0,
                                                        borderColor: '#F8C61E',
                                                    }}>
                                                        {valid && (
                                                            <Text style={{
                                                                color: hasWorkout
                                                                    ? isSelected ? '#0D1117' : '#F8C61E'
                                                                    : isSelected ? '#DCE3F1' : '#9AA4B2',
                                                                fontSize: 13,
                                                                fontWeight: hasWorkout || isSelected ? '700' : '400',
                                                            }}>
                                                                {day}
                                                            </Text>
                                                        )}
                                                    </View>
                                                </Pressable>
                                            );
                                        })}
                                    </View>
                                ))}
                            </Animated.View>
                        )}

                        {/* Legend */}
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16, marginTop: 12 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                                <View style={{ width: 12, height: 12, borderRadius: 4, backgroundColor: 'rgba(248,198,30,0.18)', borderWidth: 1, borderColor: '#F8C61E' }} />
                                <Text style={{ color: '#9AA4B2', fontSize: 11 }}>Workout done</Text>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                                <View style={{ width: 12, height: 12, borderRadius: 4, borderWidth: 1, borderColor: '#F8C61E' }} />
                                <Text style={{ color: '#9AA4B2', fontSize: 11 }}>Today</Text>
                            </View>
                        </View>
                    </View>
                </LinearGradient>

                {/* Selected Day Sessions */}
                {selectedDate !== null && (
                    <View>
                        <Text style={{ color: '#D2C5AC', fontSize: 12, fontWeight: '600', letterSpacing: 1.2, textTransform: 'uppercase', marginBottom: 12 }}>
                            {MONTHS[month - 1]} {selectedDate} · {selectedSessions.length} session{selectedSessions.length !== 1 ? 's' : ''}
                        </Text>

                        {loading ? (
                            <ActivityIndicator size="small" color="#F8C61E" style={{ marginTop: 20 }} />
                        ) : selectedSessions.length > 0 ? (
                            <View style={{ gap: 12 }}>
                                {selectedSessions.map((item: any, idx: number) => (
                                    <SessionCard key={item?.session?.id || idx} session={item} latest={false} returnTo="calendar" />
                                ))}
                            </View>
                        ) : (
                            <View style={{
                                alignItems: 'center',
                                justifyContent: 'center',
                                paddingVertical: 32,
                                borderWidth: 1,
                                borderColor: 'rgba(78,70,51,0.3)',
                                borderRadius: 16,
                                borderStyle: 'dashed',
                            }}>
                                <Text style={{ color: '#555E6E', fontSize: 14, fontWeight: '500' }}>No workout on this day</Text>
                            </View>
                        )}
                    </View>
                )}
            </ScrollView>
        </View>
    );
}
