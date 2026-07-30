import GetStats from '@/api/getStats';
import Loader from '@/components/loader';
import { useUser } from '@/components/userContext';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useMemo, useState } from 'react';
import {
    ActivityIndicator,
    Dimensions,
    Pressable,
    RefreshControl,
    ScrollView,
    Text,
    View,
} from 'react-native';
import { Defs, LinearGradient as SvgGradient, Path, Rect, Stop, Svg, Text as SvgText } from 'react-native-svg';

const SCREEN_WIDTH = Dimensions.get('window').width;
const CHART_W = SCREEN_WIDTH - 64;

// ─── helpers ───────────────────────────────────────────────────────────────

const formatDate = (d: string) => {
    const dt = new Date(d);
    return `${dt.getDate()}/${dt.getMonth() + 1}`;
};

// Smooth SVG path through points
function smoothPath(pts: { x: number; y: number }[]): string {
    if (pts.length < 2) return '';
    let d = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 1; i < pts.length; i++) {
        const prev = pts[i - 1];
        const curr = pts[i];
        const cx = (prev.x + curr.x) / 2;
        d += ` C ${cx} ${prev.y}, ${cx} ${curr.y}, ${curr.x} ${curr.y}`;
    }
    return d;
}

// ─── SVG Line Chart ─────────────────────────────────────────────────────────

interface LinePoint { value: number; label?: string }

function SVGLineChart({ data, unit, height = 180 }: { data: LinePoint[]; unit: string; height?: number }) {
    const W = CHART_W;
    const H = height;
    const PAD = { top: 16, bottom: 32, left: 46, right: 12 };
    const innerW = W - PAD.left - PAD.right;
    const innerH = H - PAD.top - PAD.bottom;

    const values = data.map(d => d.value);
    const minV = Math.min(...values);
    const maxV = Math.max(...values);
    const range = maxV - minV || 1;

    const pts = data.map((d, i) => ({
        x: PAD.left + (i / Math.max(data.length - 1, 1)) * innerW,
        y: PAD.top + (1 - (d.value - minV) / range) * innerH,
        value: d.value,
        label: d.label,
    }));

    const linePath = smoothPath(pts);
    const areaPath = linePath + ` L ${pts[pts.length - 1].x} ${PAD.top + innerH} L ${pts[0].x} ${PAD.top + innerH} Z`;

    const yTicks = [0, 0.25, 0.5, 0.75, 1].map(t => ({
        y: PAD.top + (1 - t) * innerH,
        label: (minV + t * range).toFixed(0),
    }));

    const labelIndices = data.length <= 5
        ? data.map((_, i) => i)
        : [0, Math.floor(data.length / 4), Math.floor(data.length / 2), Math.floor(3 * data.length / 4), data.length - 1];

    return (
        <Svg width={W} height={H}>
            <Defs>
                <SvgGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                    <Stop offset="0%" stopColor="#F8C61E" stopOpacity={0.25} />
                    <Stop offset="100%" stopColor="#F8C61E" stopOpacity={0} />
                </SvgGradient>
            </Defs>

            {/* Grid lines */}
            {yTicks.map((t, i) => (
                <Path key={i} d={`M ${PAD.left} ${t.y} H ${W - PAD.right}`}
                    stroke="rgba(255,255,255,0.05)" strokeWidth={1} />
            ))}

            {/* Area fill */}
            <Path d={areaPath} fill="url(#areaGrad)" />

            {/* Line */}
            <Path d={linePath} stroke="#F8C61E" strokeWidth={2.5} fill="none" strokeLinecap="round" strokeLinejoin="round" />

            {/* Data points */}
            {pts.map((p, i) => (
                <Rect key={i} x={p.x - 3} y={p.y - 3} width={6} height={6} rx={3} fill="#F8C61E" />
            ))}

            {/* Y axis labels */}
            {yTicks.map((t, i) => (
                <SvgText key={i} x={PAD.left - 6} y={t.y + 4} fontSize={9} fill="#9AA4B2" textAnchor="end">
                    {t.label}
                </SvgText>
            ))}

            {/* X axis labels */}
            {labelIndices.map(i => (
                <SvgText key={i} x={pts[i].x} y={H - 4} fontSize={9} fill="#9AA4B2" textAnchor="middle">
                    {data[i]?.label ?? ''}
                </SvgText>
            ))}
        </Svg>
    );
}

// ─── SVG Bar Chart ───────────────────────────────────────────────────────────

interface BarPoint { value: number; label?: string }

function SVGBarChart({ data, unit, height = 160 }: { data: BarPoint[]; unit: string; height?: number }) {
    const W = CHART_W;
    const H = height;
    const PAD = { top: 8, bottom: 32, left: 46, right: 8 };
    const innerW = W - PAD.left - PAD.right;
    const innerH = H - PAD.top - PAD.bottom;

    const maxV = Math.max(...data.map(d => d.value), 1);
    const barCount = data.length;
    const gap = Math.max(4, innerW / (barCount * 4));
    const barW = Math.max(6, (innerW - gap * (barCount + 1)) / barCount);

    const yTicks = [0, 0.25, 0.5, 0.75, 1].map(t => ({
        y: PAD.top + (1 - t) * innerH,
        label: (t * maxV).toFixed(0),
    }));

    const labelIndices = data.length <= 6
        ? data.map((_, i) => i)
        : [0, Math.floor(data.length / 4), Math.floor(data.length / 2), Math.floor(3 * data.length / 4), data.length - 1];
    const labelSet = new Set(labelIndices);

    return (
        <Svg width={W} height={H}>
            <Defs>
                <SvgGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                    <Stop offset="0%" stopColor="#F8C61E" stopOpacity={1} />
                    <Stop offset="100%" stopColor="#F8C61E" stopOpacity={0.4} />
                </SvgGradient>
            </Defs>

            {/* Grid lines */}
            {yTicks.map((t, i) => (
                <Path key={i} d={`M ${PAD.left} ${t.y} H ${W - PAD.right}`}
                    stroke="rgba(255,255,255,0.05)" strokeWidth={1} />
            ))}

            {/* Bars */}
            {data.map((d, i) => {
                const barH = (d.value / maxV) * innerH;
                const x = PAD.left + gap + i * (barW + gap);
                const y = PAD.top + innerH - barH;
                return (
                    <Rect key={i} x={x} y={y} width={barW} height={Math.max(barH, 2)}
                        rx={3} fill="url(#barGrad)" />
                );
            })}

            {/* Y axis labels */}
            {yTicks.map((t, i) => (
                <SvgText key={i} x={PAD.left - 6} y={t.y + 4} fontSize={9} fill="#9AA4B2" textAnchor="end">
                    {t.label}
                </SvgText>
            ))}

            {/* X axis labels */}
            {data.map((d, i) => {
                if (!labelSet.has(i)) return null;
                const x = PAD.left + gap + i * (barW + gap) + barW / 2;
                return (
                    <SvgText key={i} x={x} y={H - 4} fontSize={9} fill="#9AA4B2" textAnchor="middle">
                        {d.label ?? ''}
                    </SvgText>
                );
            })}
        </Svg>
    );
}

// ─── Section Card ────────────────────────────────────────────────────────────

function SectionCard({ children, title }: { children: React.ReactNode; title: string }) {
    return (
        <View style={{ marginBottom: 20 }}>
            <Text style={{ color: '#D2C5AC', fontSize: 12, fontWeight: '600', letterSpacing: 1.2, textTransform: 'uppercase', marginBottom: 12 }}>
                {title}
            </Text>
            <LinearGradient
                colors={['rgba(248,198,30,0.05)', 'rgba(248,198,30,0)']}
                start={{ x: 0.5, y: 0 }} end={{ x: 0.5, y: 1 }}
                style={{ borderRadius: 16 }}
            >
                <View style={{ borderWidth: 1, borderColor: 'rgba(78,70,51,0.4)', borderRadius: 16, padding: 16 }}>
                    {children}
                </View>
            </LinearGradient>
        </View>
    );
}

// ─── Stat Pill ───────────────────────────────────────────────────────────────

function StatPill({ label, value }: { label: string; value: string }) {
    return (
        <View style={{
            backgroundColor: 'rgba(248,198,30,0.08)', borderWidth: 1,
            borderColor: 'rgba(248,198,30,0.18)', borderRadius: 10,
            paddingVertical: 8, paddingHorizontal: 8,
            alignItems: 'center', flex: 1, marginHorizontal: 4,
        }}>
            <Text style={{ color: '#F8C61E', fontSize: 14, fontWeight: '700' }}>{value}</Text>
            <Text style={{ color: '#9AA4B2', fontSize: 10, marginTop: 2, textAlign: 'center' }}>{label}</Text>
        </View>
    );
}

// ─── Muscle Bar ──────────────────────────────────────────────────────────────

function MuscleBar({ name, volume, maxVolume, unit, sessions, sets }: {
    name: string; volume: number; maxVolume: number; unit: string; sessions: number; sets: number;
}) {
    const pct = maxVolume > 0 ? volume / maxVolume : 0;
    return (
        <View style={{ marginBottom: 16 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
                <Text style={{ color: '#DCE3F1', fontSize: 13, fontWeight: '600' }}>{name}</Text>
                <Text style={{ color: '#F8C61E', fontSize: 12, fontWeight: '600' }}>{volume.toLocaleString()} {unit}</Text>
            </View>
            <View style={{ height: 6, backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: 4 }}>
                <View style={{ height: 6, width: `${Math.round(pct * 100)}%`, backgroundColor: '#F8C61E', borderRadius: 4 }} />
            </View>
            <View style={{ flexDirection: 'row', gap: 8, marginTop: 4 }}>
                <Text style={{ color: '#555E6E', fontSize: 11 }}>{sessions} sessions</Text>
                <Text style={{ color: '#555E6E', fontSize: 11 }}>·</Text>
                <Text style={{ color: '#555E6E', fontSize: 11 }}>{sets} sets</Text>
            </View>
        </View>
    );
}

// ─── Main Screen ─────────────────────────────────────────────────────────────

export default function StatsScreen() {
    const { token, unit } = useUser();
    const [statsData, setStatsData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    // Filter modes: 'exercise' | 'muscle'
    const [progressionMode, setProgressionMode] = useState<'exercise' | 'muscle'>('exercise');
    const [selectedMuscleId, setSelectedMuscleId] = useState<number | 'ALL'>('ALL');
    const [selectedExerciseIdx, setSelectedExerciseIdx] = useState<number>(0);
    const [selectedMuscleIdx, setSelectedMuscleIdx] = useState<number>(0);

    const loadStats = async () => {
        if (!token) return;
        const res = await GetStats(token);
        setStatsData(res);
    };

    useEffect(() => {
        if (!token) return;
        (async () => {
            setLoading(true);
            await loadStats();
            setLoading(false);
        })();
    }, [token]);

    const onRefresh = async () => {
        setRefreshing(true);
        await loadStats();
        setRefreshing(false);
    };

    const exercises: any[] = statsData?.exerciseProgress ?? [];
    const muscleProgress: any[] = statsData?.muscleProgress ?? [];
    const weeklyVolume: any[] = statsData?.weeklyVolume ?? [];
    const muscleGroups: any[] = statsData?.muscleGroupVolume ?? [];

    // Filter exercises by muscle group filter if selected
    const filteredExercises = useMemo(() => {
        if (selectedMuscleId === 'ALL') return exercises;
        return exercises.filter(e => e.muscle_group_id === selectedMuscleId);
    }, [exercises, selectedMuscleId]);

    // Active Exercise Line Data
    const selectedExercise = filteredExercises[selectedExerciseIdx] || filteredExercises[0];
    const exerciseLineData: LinePoint[] = useMemo(() => {
        if (!selectedExercise) return [];
        return selectedExercise.data.map((d: any) => ({
            value: d.est_1rm,
            label: formatDate(d.date),
        }));
    }, [selectedExercise]);

    // Active Muscle Group Line Data
    const selectedMuscle = muscleProgress[selectedMuscleIdx] || muscleProgress[0];
    const muscleLineData: LinePoint[] = useMemo(() => {
        if (!selectedMuscle) return [];
        return selectedMuscle.data.map((d: any) => ({
            value: d.est_1rm,
            label: formatDate(d.date),
        }));
    }, [selectedMuscle]);

    // Weekly Volume Bar Data
    const barData: BarPoint[] = useMemo(() => {
        return weeklyVolume.map((w: any) => ({
            value: w.total_volume,
            label: formatDate(w.week_start),
        }));
    }, [weeklyVolume]);

    const maxMuscleVolume = muscleGroups.length > 0 ? muscleGroups[0].total_volume : 1;
    const totalVolume = useMemo(() => weeklyVolume.reduce((s: number, w: any) => s + w.total_volume, 0), [weeklyVolume]);
    const peakWeekVolume = useMemo(() => weeklyVolume.reduce((max: number, w: any) => Math.max(max, w.total_volume), 0), [weeklyVolume]);

    if (loading) {
        return <Loader />;
    }

    const hasData = exercises.length > 0 || weeklyVolume.length > 0;

    return (
        <View style={{ flex: 1, backgroundColor: '#070F18' }}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 56, paddingBottom: 110 }}
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
                <Text style={{ fontSize: 24, fontWeight: '700', color: '#DCE3F1', marginBottom: 4 }}>
                    Strength Stats
                </Text>
                <Text style={{ fontSize: 13, color: '#9AA4B2', marginBottom: 24 }}>
                    Unit: <Text style={{ color: '#F8C61E', fontWeight: '600' }}>{unit}</Text>
                </Text>

                {!hasData ? (
                    <View style={{ alignItems: 'center', justifyContent: 'center', paddingTop: 80 }}>
                        <Text style={{ color: '#555E6E', fontSize: 16, fontWeight: '600', textAlign: 'center' }}>
                            No workout data yet.{'\n'}Complete a session to see your stats!
                        </Text>
                    </View>
                ) : (
                    <>
                        {/* Summary pills */}
                        <View style={{ flexDirection: 'row', marginBottom: 24 }}>
                            <StatPill label={`Total Volume (${unit})`} value={totalVolume.toLocaleString()} />
                            <StatPill label={`Peak Week (${unit})`} value={peakWeekVolume.toLocaleString()} />
                            <StatPill label="Exercises" value={`${exercises.length}`} />
                        </View>

                        {/* Strength Progression Card */}
                        <SectionCard title="Strength Progression (Est. 1RM)">
                            {/* Mode Selector (By Exercise vs By Muscle Group) */}
                            <View style={{
                                flexDirection: 'row',
                                backgroundColor: '#0D141E',
                                borderRadius: 10,
                                padding: 3,
                                borderWidth: 1,
                                borderColor: 'rgba(78,70,51,0.5)',
                                marginBottom: 16,
                            }}>
                                <Pressable
                                    onPress={() => { setProgressionMode('exercise'); setSelectedExerciseIdx(0); }}
                                    style={{
                                        flex: 1,
                                        paddingVertical: 7,
                                        alignItems: 'center',
                                        borderRadius: 8,
                                        backgroundColor: progressionMode === 'exercise' ? 'rgba(248,198,30,0.18)' : 'transparent',
                                        borderWidth: progressionMode === 'exercise' ? 1 : 0,
                                        borderColor: 'rgba(248,198,30,0.3)',
                                    }}
                                >
                                    <Text style={{
                                        color: progressionMode === 'exercise' ? '#F8C61E' : '#9AA4B2',
                                        fontSize: 12,
                                        fontWeight: '700',
                                    }}>
                                        By Exercise
                                    </Text>
                                </Pressable>

                                <Pressable
                                    onPress={() => { setProgressionMode('muscle'); setSelectedMuscleIdx(0); }}
                                    style={{
                                        flex: 1,
                                        paddingVertical: 7,
                                        alignItems: 'center',
                                        borderRadius: 8,
                                        backgroundColor: progressionMode === 'muscle' ? 'rgba(248,198,30,0.18)' : 'transparent',
                                        borderWidth: progressionMode === 'muscle' ? 1 : 0,
                                        borderColor: 'rgba(248,198,30,0.3)',
                                    }}
                                >
                                    <Text style={{
                                        color: progressionMode === 'muscle' ? '#F8C61E' : '#9AA4B2',
                                        fontSize: 12,
                                        fontWeight: '700',
                                    }}>
                                        By Muscle Group
                                    </Text>
                                </Pressable>
                            </View>

                            {/* ── Mode 1: By Exercise ── */}
                            {progressionMode === 'exercise' && (
                                <>
                                    {/* Muscle Group Sub-Filter */}
                                    {muscleGroups.length > 0 && (
                                        <View style={{ marginBottom: 10 }}>
                                            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                                <View style={{ flexDirection: 'row', gap: 6 }}>
                                                    <Pressable
                                                        onPress={() => { setSelectedMuscleId('ALL'); setSelectedExerciseIdx(0); }}
                                                        style={{
                                                            paddingVertical: 4, paddingHorizontal: 10, borderRadius: 12,
                                                            backgroundColor: selectedMuscleId === 'ALL' ? 'rgba(248,198,30,0.2)' : 'rgba(255,255,255,0.05)',
                                                            borderWidth: 1, borderColor: selectedMuscleId === 'ALL' ? '#F8C61E' : 'transparent',
                                                        }}
                                                    >
                                                        <Text style={{ color: selectedMuscleId === 'ALL' ? '#F8C61E' : '#9AA4B2', fontSize: 11, fontWeight: '600' }}>
                                                            All Muscles
                                                        </Text>
                                                    </Pressable>

                                                    {muscleGroups.map((mg: any) => (
                                                        <Pressable
                                                            key={mg.id || mg.name}
                                                            onPress={() => { setSelectedMuscleId(mg.id); setSelectedExerciseIdx(0); }}
                                                            style={{
                                                                paddingVertical: 4, paddingHorizontal: 10, borderRadius: 12,
                                                                backgroundColor: selectedMuscleId === mg.id ? 'rgba(248,198,30,0.2)' : 'rgba(255,255,255,0.05)',
                                                                borderWidth: 1, borderColor: selectedMuscleId === mg.id ? '#F8C61E' : 'transparent',
                                                            }}
                                                        >
                                                            <Text style={{ color: selectedMuscleId === mg.id ? '#F8C61E' : '#9AA4B2', fontSize: 11, fontWeight: '600' }}>
                                                                {mg.name}
                                                            </Text>
                                                        </Pressable>
                                                    ))}
                                                </View>
                                            </ScrollView>
                                        </View>
                                    )}

                                    {/* Exercise Selector Pills */}
                                    {filteredExercises.length > 0 ? (
                                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 14 }}>
                                            <View style={{ flexDirection: 'row', gap: 8 }}>
                                                {filteredExercises.map((ex: any, idx: number) => (
                                                    <Pressable
                                                        key={ex.exercise_id}
                                                        onPress={() => setSelectedExerciseIdx(idx)}
                                                        style={{
                                                            paddingVertical: 6, paddingHorizontal: 14, borderRadius: 20,
                                                            backgroundColor: idx === selectedExerciseIdx ? '#F8C61E' : 'rgba(248,198,30,0.1)',
                                                            borderWidth: 1, borderColor: idx === selectedExerciseIdx ? '#F8C61E' : 'rgba(248,198,30,0.25)',
                                                        }}
                                                    >
                                                        <Text style={{ color: idx === selectedExerciseIdx ? '#0D1117' : '#F8C61E', fontSize: 12, fontWeight: '600' }}>
                                                            {ex.exercise_name}
                                                        </Text>
                                                    </Pressable>
                                                ))}
                                            </View>
                                        </ScrollView>
                                    ) : (
                                        <Text style={{ color: '#555E6E', textAlign: 'center', paddingVertical: 14 }}>No exercises for this muscle group</Text>
                                    )}

                                    {/* Exercise Line Chart */}
                                    {exerciseLineData.length >= 2 ? (
                                        <SVGLineChart data={exerciseLineData} unit={unit} />
                                    ) : exerciseLineData.length === 1 ? (
                                        <View style={{ alignItems: 'center', paddingVertical: 24 }}>
                                            <Text style={{ color: '#F8C61E', fontSize: 28, fontWeight: '700' }}>
                                                {exerciseLineData[0].value} {unit}
                                            </Text>
                                            <Text style={{ color: '#9AA4B2', fontSize: 12, marginTop: 4 }}>
                                                Est. 1RM — log more sessions for a trend
                                            </Text>
                                        </View>
                                    ) : (
                                        <Text style={{ color: '#555E6E', textAlign: 'center', paddingVertical: 20 }}>No data for this selection</Text>
                                    )}
                                </>
                            )}

                            {/* ── Mode 2: By Muscle Group ── */}
                            {progressionMode === 'muscle' && (
                                <>
                                    {/* Muscle Selector Pills */}
                                    {muscleProgress.length > 0 ? (
                                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 14 }}>
                                            <View style={{ flexDirection: 'row', gap: 8 }}>
                                                {muscleProgress.map((mp: any, idx: number) => (
                                                    <Pressable
                                                        key={mp.muscle_group_id}
                                                        onPress={() => setSelectedMuscleIdx(idx)}
                                                        style={{
                                                            paddingVertical: 6, paddingHorizontal: 14, borderRadius: 20,
                                                            backgroundColor: idx === selectedMuscleIdx ? '#F8C61E' : 'rgba(248,198,30,0.1)',
                                                            borderWidth: 1, borderColor: idx === selectedMuscleIdx ? '#F8C61E' : 'rgba(248,198,30,0.25)',
                                                        }}
                                                    >
                                                        <Text style={{ color: idx === selectedMuscleIdx ? '#0D1117' : '#F8C61E', fontSize: 12, fontWeight: '600' }}>
                                                            {mp.muscle_group_name}
                                                        </Text>
                                                    </Pressable>
                                                ))}
                                            </View>
                                        </ScrollView>
                                    ) : (
                                        <Text style={{ color: '#555E6E', textAlign: 'center', paddingVertical: 14 }}>No muscle group data</Text>
                                    )}

                                    {/* Muscle Line Chart */}
                                    {muscleLineData.length >= 2 ? (
                                        <SVGLineChart data={muscleLineData} unit={unit} />
                                    ) : muscleLineData.length === 1 ? (
                                        <View style={{ alignItems: 'center', paddingVertical: 24 }}>
                                            <Text style={{ color: '#F8C61E', fontSize: 28, fontWeight: '700' }}>
                                                {muscleLineData[0].value} {unit}
                                            </Text>
                                            <Text style={{ color: '#9AA4B2', fontSize: 12, marginTop: 4 }}>
                                                Peak Est. 1RM — log more sessions for a trend
                                            </Text>
                                        </View>
                                    ) : (
                                        <Text style={{ color: '#555E6E', textAlign: 'center', paddingVertical: 20 }}>No data for this muscle group</Text>
                                    )}
                                </>
                            )}

                            <Text style={{ color: '#555E6E', fontSize: 11, marginTop: 10, textAlign: 'right' }}>
                                Epley formula · weight × (1 + reps / 30)
                            </Text>
                        </SectionCard>

                        {/* Weekly Volume */}
                        {weeklyVolume.length > 0 && (
                            <SectionCard title="Weekly Volume">
                                {barData.length >= 2 ? (
                                    <SVGBarChart data={barData} unit={unit} />
                                ) : (
                                    <View style={{ alignItems: 'center', paddingVertical: 24 }}>
                                        <Text style={{ color: '#F8C61E', fontSize: 28, fontWeight: '700' }}>
                                            {weeklyVolume[0]?.total_volume.toLocaleString()} {unit}
                                        </Text>
                                        <Text style={{ color: '#9AA4B2', fontSize: 12, marginTop: 4 }}>This week's total volume</Text>
                                    </View>
                                )}
                            </SectionCard>
                        )}

                        {/* Muscle Group Breakdown */}
                        {muscleGroups.length > 0 && (
                            <SectionCard title="Muscle Group Volume">
                                {muscleGroups.map((mg: any) => (
                                    <MuscleBar
                                        key={mg.name}
                                        name={mg.name}
                                        volume={mg.total_volume}
                                        maxVolume={maxMuscleVolume}
                                        unit={unit}
                                        sessions={mg.session_count}
                                        sets={mg.total_sets}
                                    />
                                ))}
                            </SectionCard>
                        )}
                    </>
                )}
            </ScrollView>
        </View>
    );
}
