// import React from 'react';
// import { Stack } from 'expo-router';
// import { ChecklistMenu } from '@/components/ChecklistMenu';

// type ChecklistParamList = {
//   index: { title?: string; projectId?: number };
//   success: undefined;
// };

// export default function ChecklistLayout() {
//   return (
//     <Stack initialRouteName="index" screenOptions={{ headerShown: false }}>
//       <Stack.Screen
//         options={({ route }) => {
//           const title = (route.params as ChecklistParamList['index'])?.title;
//           const projectId = (route.params as ChecklistParamList['index'])?.projectId;
//           const headerMenuVisible = title && projectId;

//           return {
//             headerShown: true,
//             headerTitle: (route.params as ChecklistParamList['index'])?.title ?? 'Checklist',
//             headerRight: () =>
//               headerMenuVisible && <ChecklistMenu projectId={projectId} title={title} />,
//           };
//         }}
//         name="index"
//       />
//       <Stack.Screen name="success" />
//     </Stack>
//   );
// }
