import Lightning from '@/assets/icons/lightning';
import NotificationIcon from '@/assets/icons/notificationicon';
import ProfileIcon from '@/assets/icons/profile';
import RightIcon from '@/assets/icons/righticon';
import { useUser } from '@/components/userContext';
import { LinearGradient } from 'expo-linear-gradient';
import { ScrollView, Text, View } from 'react-native';

export default function TabThreeScreen() {

    const { user } = useUser()

    return (
        <View className="flex-1 bg-[#070F18] px-4 pt-24">
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
                <View className="w-full flex flex-col items-center justify-center p-2 border-[1px] border-[#4E4633] rounded-[16px]">
                    <View className='h-[80px] w-[80px] rounded-full border-[1px] border-brand bg-[#151C26] flex items-center justify-center mt-2'>
                        <Text className='text-[24px] font-bold text-brand'>{user?.username?.slice(0, 1).toUpperCase()}</Text>
                    </View>
                    <Text className='text-[24px] font-bold text-[#DCE3F1] mt-4'>{user?.username}</Text>
                    <View className='flex flex-row items-center justify-center gap-1 bg-brand/20 px-3 py-1 rounded-full my-4'>
                        <Lightning color={'#F8C61E'} />
                        <Text className='text-[14px] font-semibold text-[#DCE3F1]'> Strength Level : Advanced </Text>
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

                <View className=' pt-3 w-full'>
                    <Text className='text-[12px] text-[#D2C5AC]  tracking-wider uppercase pb-3'>
                        GENERAL SETTINGS
                    </Text>
                    <View className=' flex px-4 w-full bg-[#19202B] rounded-xl border border-[#4E4633]/20 ' >
                        <View className=' flex flex-row items-center justify-between h-[56px] border-b-[1px] border-[#4E4633]/20 ' >
                            <View className=' flex flex-row items-center justify-center ' >
                                <ProfileIcon color='#F8C61E' height={24} width={24} />
                                <Text className='text-[18px]  text-[#DCE3F1] ml-1'> Account Settings </Text>
                            </View>
                            <RightIcon />
                        </View>
                        <View className=' flex flex-row items-center justify-between h-[56px] border-b-[1px] border-[#4E4633]/20 ' >
                            <View className=' flex flex-row items-center justify-center ' >
                                <NotificationIcon />
                                <Text className='text-[18px]  text-[#DCE3F1] ml-1'> Notifications </Text>
                            </View>
                            <RightIcon />
                        </View>
                        <View className=' flex flex-row items-center justify-between h-[56px] border-b-[1px] border-[#4E4633]/20 ' >
                            <View className=' flex flex-row items-center justify-center ' >
                                <ProfileIcon color='#F8C61E' height={24} width={24} />
                                <Text className='text-[18px]  text-[#DCE3F1] ml-1'> Account Settings </Text>
                            </View>
                            <RightIcon />
                        </View>
                    </View>
                </View>

            </ScrollView>
        </View>
    );
}
