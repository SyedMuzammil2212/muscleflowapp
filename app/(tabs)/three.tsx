import Lightning from '@/assets/icons/lightning';
import { useUser } from '@/components/userContext';
import { LinearGradient } from 'expo-linear-gradient';
import { ScrollView, Text, View } from 'react-native';

export default function TabThreeScreen() {

    const { user } = useUser()

    return (
        <View className="flex-1 bg-[#070F18] px-4 pt-12">
            {/* Fixed LinearGradient Box */}
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
                <View className="w-full flex flex-col items-center justify-center p-2 border-[1px] border-[#4E4633] rounded-xl">
                    <View className='h-[100px] w-[100px] rounded-full border-[1px] border-brand bg-[#151C26] flex items-center justify-center mt-2'>
                        <Text className='text-[32px] font-bold text-brand'>{user?.username?.slice(0, 1).toUpperCase()}</Text>
                    </View>
                    <Text className='text-[36px] font-bold text-[#DCE3F1] mt-4'>{user?.username}</Text>
                    <View className='flex flex-row items-center justify-center gap-1 bg-brand/20 px-3 py-1 rounded-full my-4'>
                        <Lightning color={'#F8C61E'} />
                        <Text className='text-[18px] font-semibold text-[#DCE3F1]'> Strength Level : Advanced </Text>
                    </View>

                    <View className='flex flex-row items-center justify-between mt-2 mb-4 gap-4'>
                        <View className='bg-[#151C26] border-[1px] border-[#4E4633]/20 py-3 rounded-lg w-[100px] flex flex-col items-center justify-center gap-1'>
                            <Text className='text-[12px] uppercase font-semibold text-[#D2C5AC]'>Workouts </Text>
                            <Text className='text-[22px] font-semibold text-brand'> 20 </Text>
                        </View>
                        <View className='bg-[#151C26] border-[1px] border-[#4E4633]/20 py-3 rounded-lg w-[100px] flex flex-col items-center justify-center gap-1'>
                            <Text className='text-[12px] uppercase font-semibold text-[#D2C5AC]'> Streak </Text>
                            <Text className='text-[22px] font-semibold text-brand'> 30 </Text>
                        </View>
                        <View className='bg-[#151C26] border-[1px] border-[#4E4633]/20 py-3 rounded-lg w-[100px] flex flex-col items-center justify-center gap-1'>
                            <Text className='text-[12px] uppercase font-semibold text-[#D2C5AC]'> Volume </Text>
                            <Text className='text-[22px] font-semibold text-brand'> 10 </Text>
                        </View>
                    </View>
                </View>
            </LinearGradient>

            {/* Scrollable Section below the LinearGradient box */}
            <ScrollView
                className="flex-1 w-full mt-4"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 24 }}
            >
                {/* Add any scrollable items or cards here */}
            </ScrollView>
        </View>
    );
}
