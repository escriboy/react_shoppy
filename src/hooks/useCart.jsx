import { useAuthContext } from '../context/Authcontext';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { addOrUpdateToCart, getCart, removeFromCart } from '../api/firebase';

export default function useCart() {
  const { uid } = useAuthContext();
  const queryClient = useQueryClient();

  const cartQuery = useQuery(['carts', uid || ''], () => getCart(uid), {
    enabled: !!uid,
    // !! => [undefined, "", 0] 일 경우 결과는 false,
    // 그 외에 결과는 모두 true
  });

  const addOrUpdateItem = useMutation(
    (product) => addOrUpdateToCart(uid, product),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['carts', uid]);
      },
    }
  );

  const removeItem = useMutation((id) => removeFromCart(uid, id), {
    onSuccess: () => {
      queryClient.invalidateQueries(['carts', uid]);
    },
  });

  return { cartQuery, addOrUpdateItem, removeItem };
}
