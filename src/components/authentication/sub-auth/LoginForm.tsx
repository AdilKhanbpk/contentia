"use client";
import { useForm, SubmitHandler } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, logoutUser } from "@/store/features/auth/loginSlice";
import { RootState } from "@/store/store";
import { AppDispatch } from "@/store/store";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useTokenContext } from "@/context/TokenCheckingContext";

interface IFormInput {
    email: string;
    password: string;
    rememberMe: boolean;
}

const LoginForm = () => {
    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<IFormInput>();
    const dispatch = useDispatch<AppDispatch>();
    const { loading } = useSelector((state: RootState) => state.login);
    const { setToken } = useTokenContext();

    const onSubmit: SubmitHandler<IFormInput> = async (data) => {
        try {
            const response = await dispatch(loginUser(data)).unwrap();
            if (response.token) {
                setToken(response.token);
            }
            const admin = response.user.role === "admin";
            const customer = response.user.role === "user";

            toast.success("Login successful");

            if (admin) {
                router.push("/admin");
            } else if (customer) {
                router.push("/siparis-olustur");
            } else {
                router.push("/giris-yap");
            }
        } catch (error: any) {
            toast.error(error?.message || "Login failed: An error occurred");
        }
    };

    const handleGoogleLogin = () => {
        // Using the backend's Google auth endpoint
        window.location.href = `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/auth/google?userType=user`;
    };

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className='px-4'
        >
            <button
                type='button'
                onClick={handleGoogleLogin}
                className='flex justify-center w-full text-gray-700 mb-4 border border-gray-300'
            >
                <Image
                    src='/googleIcon.svg'
                    width={15}
                    height={15}
                    alt='Google Icon'
                    className='p-1.5 w-10 h-10 border-r border-gray-300'
                />
                <div className='w-11/12 py-2'>Google ile devam et</div>
            </button>

            <div className='text-center mb-4 text-gray-500'>veya</div>

            <div className='mb-4'>
                <div className='flex items-center border border-gray-300'>
                    <div className='bg-gray-100 p-2 rounded-l border-r border-gray-300'>
                        <img
                            src='/messageIcon.png'
                            alt='Email Icon'
                            className='w-7 h-7'
                        />
                    </div>
                    <input
                        type='email'
                        {...register("email", {
                            required: "E-posta zorunludur",
                        })}
                        className='w-full px-4 py-2 focus:outline-none'
                        placeholder='eposta@gmail.com'
                    />
                </div>
                {errors.email && (
                    <span className='text-red-500'>{errors.email.message}</span>
                )}
            </div>

            <div className='mb-4'>
                <div className='flex items-center border border-gray-300'>
                    <div className='bg-gray-100 p-2 rounded-l border-r border-gray-300'>
                        <img
                            src='/lockIcon.png'
                            alt='Password Icon'
                            className='w-7 h-7'
                        />
                    </div>
                    <input
                        type='password'
                        {...register("password", {
                            required: "Şifre zorunludur",
                        })}
                        className='w-full px-4 py-2 focus:outline-none'
                        placeholder='şifrenizi girin'
                    />
                </div>
                {errors.password && (
                    <span className='text-red-500'>
                        {errors.password.message}
                    </span>
                )}
            </div>

            <div className='flex items-start mt-4 mb-4'>
                <input
                    id='rememberMe'
                    type='checkbox'
                    className='mt-1 mr-2'
                    {...register("rememberMe")}
                />
                <label
                    htmlFor='rememberMe'
                    className='text-sm text-gray-500'
                >
                    Beni Hatırla
                </label>
            </div>
            <div className="flex w-full justify-center mb-2">
                <span className="text-blue-500 cursor-pointer"
                onClick={() => router.push("/forgot-password")}>Şifreni hatırlamıyor musunn?</span>
                </div>
            {errors.rememberMe && (
                <span className='text-red-500'>
                    Lütfen göndermeden önce Beni Hatırla kısmını doldurunuz.
                </span>
            )}

            <button
                type='submit'
                className='w-full Button text-white py-2 rounded-lg font-semibold'
                disabled={loading}
            >
                {loading ? "Yükleniyor..." : "Giriş Yap"}
            </button>

            {/* Show error message */}
            {errors && (
                <div className='text-red-500 text-center mt-4'>
                    {errors.email?.message || errors.password?.message}
                </div>
            )}
        </form>
    );
};

export default LoginForm;
