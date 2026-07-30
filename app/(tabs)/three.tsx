import changePassword from '@/api/changePassword';
import CreateExercise from '@/api/createExercise';
import GetAllMuscleGroups from '@/api/getAllMusclesGroups';
import GetExercisesByMuscleIds from '@/api/getExcercisesByMuscleIds';
import updateProfile from '@/api/updateProfile';
import DumbbellIcon from '@/assets/icons/dumbellicon';
import Lightning from '@/assets/icons/lightning';
import NotificationIcon from '@/assets/icons/notificationicon';
import ProfileIcon from '@/assets/icons/profile';
import RightIcon from '@/assets/icons/righticon';
import ScaleIcon from '@/assets/icons/scaleicon';
import { useUser } from '@/components/userContext';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Modal,
    Platform,
    Pressable,
    RefreshControl,
    ScrollView,
    Switch,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

export default function TabThreeScreen() {
    const { user, token, unit, setUnit, refreshUser } = useUser();

    // Muscle groups & exercises state
    const [muscleGroups, setMuscleGroups] = useState<any[]>([]);
    const [selectedMuscleId, setSelectedMuscleId] = useState<number | null>(null);
    const [exercises, setExercises] = useState<any[]>([]);
    const [loadingExercises, setLoadingExercises] = useState(false);

    // Modal state for adding custom exercise
    const [modalVisible, setModalVisible] = useState(false);
    const [newExerciseName, setNewExerciseName] = useState('');
    const [modalMuscleId, setModalMuscleId] = useState<number | null>(null);
    const [creating, setCreating] = useState(false);

    // Modal state for Account Settings
    const [accountModalVisible, setAccountModalVisible] = useState(false);
    const [editUsername, setEditUsername] = useState(user?.username || '');
    const [updatingUsername, setUpdatingUsername] = useState(false);

    // Password fields
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [updatingPassword, setUpdatingPassword] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchMuscleGroups();
        if (selectedMuscleId) {
            await fetchExercises(selectedMuscleId);
        }
        setRefreshing(false);
    };

    useEffect(() => {
        if (user?.username) {
            setEditUsername(user.username);
        }
    }, [user]);

    // Load all muscle groups on mount & refresh stats
    const fetchMuscleGroups = async () => {
        if (!token) return;
        if (refreshUser) refreshUser();
        const res = await GetAllMuscleGroups(token);
        if (res?.muscleGroups) {
            setMuscleGroups(res.muscleGroups);
            if (res.muscleGroups.length > 0) {
                setSelectedMuscleId(res.muscleGroups[0].id);
                setModalMuscleId(res.muscleGroups[0].id);
            }
        }
    };

    // Load exercises when selected muscle group changes
    const fetchExercises = async (muscleId: number) => {
        if (!token || !muscleId) return;
        setLoadingExercises(true);
        const res = await GetExercisesByMuscleIds(token, { musclegroupids: [muscleId] });
        if (res?.exercises) {
            setExercises(res.exercises);
        } else {
            setExercises([]);
        }
        setLoadingExercises(false);
    };

    useEffect(() => {
        fetchMuscleGroups();
    }, [token]);

    useEffect(() => {
        if (selectedMuscleId) {
            fetchExercises(selectedMuscleId);
        }
    }, [selectedMuscleId]);

    const handleCreateExercise = async () => {
        if (!newExerciseName.trim()) {
            Alert.alert("Missing Name", "Please enter an exercise name.");
            return;
        }
        if (!modalMuscleId) {
            Alert.alert("Missing Muscle Group", "Please select a muscle group.");
            return;
        }

        setCreating(true);
        const res = await CreateExercise(token, newExerciseName.trim(), modalMuscleId);
        setCreating(false);

        if (res?.exercise) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            setModalVisible(false);
            setNewExerciseName('');

            if (modalMuscleId === selectedMuscleId) {
                fetchExercises(selectedMuscleId);
            } else {
                setSelectedMuscleId(modalMuscleId);
            }
        } else {
            Alert.alert("Error", res?.message || "Failed to create exercise.");
        }
    };

    const handleUpdateUsername = async () => {
        if (!editUsername.trim()) {
            Alert.alert("Invalid Input", "Username cannot be empty.");
            return;
        }

        setUpdatingUsername(true);
        const res = await updateProfile(token, editUsername.trim());
        setUpdatingUsername(false);

        if (res?.user) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            Alert.alert("Success", "Username updated successfully!");
            if (refreshUser) refreshUser();
        } else {
            Alert.alert("Error", res?.error || res?.message || "Failed to update username.");
        }
    };

    const handleChangePassword = async () => {
        if (!currentPassword || !newPassword) {
            Alert.alert("Missing Fields", "Please enter your current and new password.");
            return;
        }
        if (newPassword.length < 6) {
            Alert.alert("Weak Password", "New password must be at least 6 characters.");
            return;
        }

        setUpdatingPassword(true);
        const res = await changePassword(token, currentPassword, newPassword);
        setUpdatingPassword(false);

        if (res?.message && !res?.error) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            Alert.alert("Success", "Password updated successfully!");
            setCurrentPassword('');
            setNewPassword('');
        } else {
            Alert.alert("Error", res?.error || res?.message || "Failed to update password.");
        }
    };

    const formatVolume = (vol: number = 0) => {
        if (vol >= 1000) {
            return `${(vol / 1000).toFixed(1)}k`;
        }
        return `${Math.round(vol)}`;
    };

    return (
        <View className="flex-1 bg-[#070F18] px-4 pt-24">
            {/* Fixed LinearGradient Summary Box */}
            <LinearGradient
                colors={[
                    "rgba(248, 198, 30, 0.05)",
                    "rgba(248, 198, 30, 0)",
                ]}
                start={{ x: 0.5, y: 0 }}
                end={{ x: 0.5, y: 1 }}
                style={{
                    borderRadius: 12,
                    width: "100%"
                }}>
                <View className="w-full flex flex-col items-center justify-center p-2 border-[1px] border-[#4E4633] rounded-[16px]">
                    <View className='h-[80px] w-[80px] rounded-full border-[1px] border-brand bg-[#151C26] flex items-center justify-center mt-2'>
                        <Text className='text-[24px] font-bold text-brand'>{user?.username?.slice(0, 1).toUpperCase()}</Text>
                    </View>
                    <Text className='text-[24px] font-bold text-[#DCE3F1] mt-4'>{user?.username}</Text>
                    <View className='flex flex-row items-center justify-center gap-1 bg-brand/20 px-3 py-1 rounded-full my-4'>
                        <Lightning color={'#F8C61E'} />
                        <Text className='text-[14px] font-semibold text-[#DCE3F1]'> Strength Level : {user?.stats?.strengthLevel || 'Beginner'} </Text>
                    </View>

                    <View className='flex flex-row items-center justify-between mt-2 mb-4 gap-4'>
                        <View className='bg-[#151C26] border-[1px] border-[#4E4633]/20 py-3 rounded-lg w-[100px] flex flex-col items-center justify-center gap-1'>
                            <Text className='text-[12px] uppercase font-semibold text-[#D2C5AC]'>Workouts </Text>
                            <Text className='text-[22px] font-semibold text-brand'>{user?.stats?.workoutCount ?? 0}</Text>
                        </View>
                        <View className='bg-[#151C26] border-[1px] border-[#4E4633]/20 py-3 rounded-lg w-[100px] flex flex-col items-center justify-center gap-1'>
                            <Text className='text-[12px] uppercase font-semibold text-[#D2C5AC]'> Streak </Text>
                            <Text className='text-[22px] font-semibold text-brand'>{user?.stats?.streak ?? 0}d</Text>
                        </View>
                        <View className='bg-[#151C26] border-[1px] border-[#4E4633]/20 py-3 rounded-lg w-[100px] flex flex-col items-center justify-center gap-1'>
                            <Text className='text-[12px] uppercase font-semibold text-[#D2C5AC]'> Volume ({unit}) </Text>
                            <Text className='text-[22px] font-semibold text-brand'>{formatVolume(user?.stats?.totalVolume)}</Text>
                        </View>
                    </View>
                </View>
            </LinearGradient>

            {/* Scrollable Settings & Exercise Management */}
            <ScrollView
                className="flex-1 w-full mt-4"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 110 }}
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
                {/* GENERAL SETTINGS */}
                <View className='pt-3 w-full'>
                    <Text className='text-[12px] text-[#D2C5AC] tracking-wider uppercase pb-3'>
                        GENERAL SETTINGS
                    </Text>
                    <View className='flex px-4 w-full bg-[#19202B] rounded-xl border border-[#4E4633]/20'>
                        <TouchableOpacity
                            onPress={() => {
                                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                setAccountModalVisible(true);
                            }}
                            className='flex flex-row items-center justify-between h-[56px] border-b-[1px] border-[#4E4633]/20'
                        >
                            <View className='flex flex-row items-center justify-center'>
                                <ProfileIcon color='#F8C61E' height={24} width={24} />
                                <Text className='text-[18px] text-[#DCE3F1] ml-1'> Account Settings </Text>
                            </View>
                            <RightIcon />
                        </TouchableOpacity>

                        <View className='flex flex-row items-center justify-between h-[56px] border-b-[1px] border-[#4E4633]/20'>
                            <View className='flex flex-row items-center justify-center'>
                                <NotificationIcon />
                                <Text className='text-[18px] text-[#DCE3F1] ml-1'> Notifications </Text>
                            </View>
                            <RightIcon />
                        </View>

                        <View className='flex flex-row items-center justify-between h-[56px]'>
                            <View className='flex flex-row items-center justify-center'>
                                <ScaleIcon />
                                <Text className='text-[18px] text-[#DCE3F1] ml-2'> Units </Text>
                            </View>
                            <View className='flex flex-row items-center gap-2'>
                                <Text style={{ color: unit === 'kg' ? '#F8C61E' : '#888', fontWeight: '600', fontSize: 14 }}>kg</Text>
                                <Switch
                                    value={unit === 'lb'}
                                    onValueChange={(val) => setUnit(val ? 'lb' : 'kg')}
                                    trackColor={{ false: '#2A3340', true: '#2A3340' }}
                                    thumbColor={unit === 'lb' ? '#F8C61E' : '#F8C61E'}
                                    ios_backgroundColor='#2A3340'
                                />
                                <Text style={{ color: unit === 'lb' ? '#F8C61E' : '#888', fontWeight: '600', fontSize: 14 }}>lb</Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* EXERCISE MANAGEMENT SECTION */}
                <View className='pt-6 w-full'>
                    <View className="flex-row items-center justify-between pb-3">
                        <Text className='text-[12px] text-[#D2C5AC] tracking-wider uppercase'>
                            EXERCISE MANAGEMENT
                        </Text>
                        <TouchableOpacity
                            onPress={() => {
                                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                setModalVisible(true);
                            }}
                            className="flex-row items-center bg-[#F8C61E]/20 px-3 py-1 rounded-full border border-[#F8C61E]/40 gap-x-1"
                        >
                            <Ionicons name="add-circle-outline" size={16} color="#F8C61E" />
                            <Text className="text-[#F8C61E] text-xs font-bold">+ Add Exercise</Text>
                        </TouchableOpacity>
                    </View>

                    <View className='flex px-4 py-4 w-full bg-[#19202B] rounded-xl border border-[#4E4633]/20 gap-y-3'>
                        {/* Muscle Group Horizontal Selector */}
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            <View className="flex-row gap-x-2">
                                {muscleGroups.map((mg) => (
                                    <Pressable
                                        key={mg.id}
                                        onPress={() => {
                                            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                            setSelectedMuscleId(mg.id);
                                        }}
                                        className={`px-3 py-1.5 rounded-full border ${selectedMuscleId === mg.id
                                                ? 'bg-[#F8C61E] border-[#F8C61E]'
                                                : 'bg-[#151C26] border-[#4E4633]/40'
                                            }`}
                                    >
                                        <Text className={`text-xs font-bold ${selectedMuscleId === mg.id ? 'text-[#070F18]' : 'text-[#DCE3F1]'
                                            }`}>
                                            {mg.name}
                                        </Text>
                                    </Pressable>
                                ))}
                            </View>
                        </ScrollView>

                        {/* Exercises List for Selected Muscle Group */}
                        <View className="pt-2">
                            {loadingExercises ? (
                                <ActivityIndicator size="small" color="#F8C61E" style={{ paddingVertical: 16 }} />
                            ) : exercises.length > 0 ? (
                                <View className="gap-y-2">
                                    {exercises.map((ex) => (
                                        <View
                                            key={ex.id}
                                            className="flex-row items-center justify-between bg-[#151C26] px-3 py-2.5 rounded-lg border border-[#4E4633]/20"
                                        >
                                            <View className="flex-row items-center gap-x-2">
                                                <DumbbellIcon width={16} height={16} color="#F8C61E" />
                                                <Text className="text-[#DCE3F1] text-sm font-semibold">{ex.name}</Text>
                                            </View>
                                            {ex.user_id ? (
                                                <View className="bg-[#F8C61E]/20 px-2 py-0.5 rounded border border-[#F8C61E]/40">
                                                    <Text className="text-[#F8C61E] text-[10px] font-bold">CUSTOM</Text>
                                                </View>
                                            ) : (
                                                <Text className="text-[#555E6E] text-[10px] font-semibold">DEFAULT</Text>
                                            )}
                                        </View>
                                    ))}
                                </View>
                            ) : (
                                <Text className="text-[#555E6E] text-xs text-center py-4">
                                    No exercises found for this muscle group.
                                </Text>
                            )}
                        </View>
                    </View>
                </View>
            </ScrollView>

            {/* ACCOUNT SETTINGS MODAL */}
            <Modal
                visible={accountModalVisible}
                transparent
                animationType="slide"
                onRequestClose={() => setAccountModalVisible(false)}
            >
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={{ flex: 1 }}
                >
                    <View className="flex-1 bg-black/75 justify-end">
                        <View className="w-full bg-[#19202B] border-t border-[#4E4633] rounded-t-3xl p-6 gap-y-5 max-h-[85%]">
                            <View className="flex-row justify-between items-center pb-3 border-b border-[#4E4633]/40">
                                <Text className="text-[#DCE3F1] text-xl font-bold">Account Settings</Text>
                                <TouchableOpacity onPress={() => setAccountModalVisible(false)}>
                                    <Ionicons name="close-circle" size={26} color="#9AA4B2" />
                                </TouchableOpacity>
                            </View>

                            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ gap: 20, paddingBottom: 20 }}>
                                {/* User Profile Card */}
                                <View className="bg-[#151C26] p-4 rounded-xl border border-[#4E4633]/30 gap-y-2">
                                    <Text className="text-[#D2C5AC] text-xs font-semibold uppercase">Account Information</Text>
                                    <View className="flex-row items-center justify-between">
                                        <Text className="text-[#9AA4B2] text-xs">Email Address</Text>
                                        <Text className="text-[#DCE3F1] text-xs font-semibold">{user?.email || 'N/A'}</Text>
                                    </View>
                                    <View className="flex-row items-center justify-between">
                                        <Text className="text-[#9AA4B2] text-xs">Auth Method</Text>
                                        {user?.google_id ? (
                                            <View className="bg-brand/20 px-2 py-0.5 rounded border border-brand/40">
                                                <Text className="text-brand text-[10px] font-extrabold">GOOGLE SIGN-IN</Text>
                                            </View>
                                        ) : (
                                            <View className="bg-[#4E4633]/40 px-2 py-0.5 rounded border border-[#4E4633]">
                                                <Text className="text-[#DCE3F1] text-[10px] font-extrabold">EMAIL / PASSWORD</Text>
                                            </View>
                                        )}
                                    </View>
                                </View>

                                {/* Edit Username */}
                                <View className="gap-y-2">
                                    <Text className="text-[#D2C5AC] text-xs font-semibold uppercase">Edit Display Name</Text>
                                    <View className="flex-row gap-x-2">
                                        <TextInput
                                            className="flex-1 bg-[#151C26] border border-[#4E4633]/40 rounded-xl px-4 py-3 text-[#DCE3F1] text-sm font-medium"
                                            value={editUsername}
                                            onChangeText={setEditUsername}
                                            placeholder="Username"
                                            placeholderTextColor="#555E6E"
                                        />
                                        <TouchableOpacity
                                            onPress={handleUpdateUsername}
                                            disabled={updatingUsername}
                                            className="bg-[#F8C61E] px-4 rounded-xl items-center justify-center"
                                        >
                                            {updatingUsername ? (
                                                <ActivityIndicator color="#070F18" size="small" />
                                            ) : (
                                                <Text className="text-[#070F18] text-xs font-extrabold uppercase">Save</Text>
                                            )}
                                        </TouchableOpacity>
                                    </View>
                                </View>

                                {/* Security & Password (only for Email/Password users) */}
                                {!user?.google_id ? (
                                    <View className="gap-y-3 pt-2">
                                        <Text className="text-[#D2C5AC] text-xs font-semibold uppercase">Change Password</Text>
                                        <TextInput
                                            className="bg-[#151C26] border border-[#4E4633]/40 rounded-xl px-4 py-3 text-[#DCE3F1] text-sm font-medium"
                                            secureTextEntry
                                            placeholder="Current Password"
                                            placeholderTextColor="#555E6E"
                                            value={currentPassword}
                                            onChangeText={setCurrentPassword}
                                        />
                                        <TextInput
                                            className="bg-[#151C26] border border-[#4E4633]/40 rounded-xl px-4 py-3 text-[#DCE3F1] text-sm font-medium"
                                            secureTextEntry
                                            placeholder="New Password (min 6 chars)"
                                            placeholderTextColor="#555E6E"
                                            value={newPassword}
                                            onChangeText={setNewPassword}
                                        />
                                        <TouchableOpacity
                                            onPress={handleChangePassword}
                                            disabled={updatingPassword}
                                            className="bg-[#151C26] border border-[#F8C61E]/60 py-3.5 rounded-xl items-center justify-center mt-1"
                                        >
                                            {updatingPassword ? (
                                                <ActivityIndicator color="#F8C61E" size="small" />
                                            ) : (
                                                <Text className="text-[#F8C61E] text-xs font-extrabold uppercase tracking-wide">
                                                    Update Password
                                                </Text>
                                            )}
                                        </TouchableOpacity>
                                    </View>
                                ) : (
                                    <View className="bg-[#151C26] p-3 rounded-xl border border-[#4E4633]/20">
                                        <Text className="text-[#555E6E] text-xs text-center">
                                            You are signed in with Google. Passwords are managed securely through your Google Account.
                                        </Text>
                                    </View>
                                )}
                            </ScrollView>
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </Modal>

            {/* ADD CUSTOM EXERCISE MODAL */}
            <Modal
                visible={modalVisible}
                transparent
                animationType="fade"
                onRequestClose={() => setModalVisible(false)}
            >
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={{ flex: 1 }}
                >
                    <View className="flex-1 bg-black/70 justify-center items-center px-4">
                        <View className="w-full bg-[#19202B] border border-[#4E4633] rounded-2xl p-5 gap-y-4">
                            <View className="flex-row justify-between items-center pb-2 border-b border-[#4E4633]/40">
                                <Text className="text-[#DCE3F1] text-lg font-bold">Add Custom Exercise</Text>
                                <TouchableOpacity onPress={() => setModalVisible(false)}>
                                    <Ionicons name="close" size={24} color="#9AA4B2" />
                                </TouchableOpacity>
                            </View>

                            {/* Exercise Name Input */}
                            <View className="gap-y-1.5">
                                <Text className="text-[#D2C5AC] text-xs font-semibold uppercase">Exercise Name</Text>
                                <TextInput
                                    className="bg-[#151C26] border border-[#4E4633]/40 rounded-xl px-4 py-3 text-[#DCE3F1] text-sm font-medium"
                                    placeholder="e.g. Incline Dumbbell Press"
                                    placeholderTextColor="#555E6E"
                                    value={newExerciseName}
                                    onChangeText={setNewExerciseName}
                                />
                            </View>

                            {/* Muscle Group Picker */}
                            <View className="gap-y-1.5">
                                <Text className="text-[#D2C5AC] text-xs font-semibold uppercase">Select Muscle Group</Text>
                                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                    <View className="flex-row gap-x-2 py-1">
                                        {muscleGroups.map((mg) => (
                                            <Pressable
                                                key={mg.id}
                                                onPress={() => setModalMuscleId(mg.id)}
                                                className={`px-3 py-2 rounded-xl border ${modalMuscleId === mg.id
                                                        ? 'bg-[#F8C61E] border-[#F8C61E]'
                                                        : 'bg-[#151C26] border-[#4E4633]/40'
                                                    }`}
                                            >
                                                <Text className={`text-xs font-bold ${modalMuscleId === mg.id ? 'text-[#070F18]' : 'text-[#DCE3F1]'
                                                    }`}>
                                                    {mg.name}
                                                </Text>
                                            </Pressable>
                                        ))}
                                    </View>
                                </ScrollView>
                            </View>

                            {/* Submit Button */}
                            <TouchableOpacity
                                onPress={handleCreateExercise}
                                disabled={creating}
                                className="bg-[#F8C61E] rounded-xl py-3.5 items-center justify-center mt-2 active:opacity-90"
                            >
                                {creating ? (
                                    <ActivityIndicator color="#070F18" />
                                ) : (
                                    <Text className="text-[#070F18] text-sm font-extrabold uppercase tracking-wide">
                                        Save Exercise
                                    </Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </Modal>
        </View>
    );
}
