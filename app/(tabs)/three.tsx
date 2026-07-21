import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';
import { Link } from 'expo-router';

export default function TabThreeScreen() {

    return (
        <View className="flex-1 items-center justify-center">
            <Text className="text-xl font-bold">Tab Three</Text>
            <View className="my-8 h-px w-4/5" lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
            <EditScreenInfo path="app/(tabs)/two.tsx" />
            <Link href={"/login"}>
                <Text className="text-red-500 text-xl font-bold">Login</Text>
            </Link>
        </View>
    );
}
