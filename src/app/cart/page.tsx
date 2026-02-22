'use client';

import { useCart } from '@/store/useCart';
import Link from 'next/link';
import { Trash2 } from 'lucide-react';

export default function CartPage() {
    const { items, removeItem, updateQuantity, total } = useCart();

    if (items.length === 0) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
                <h2 className="text-3xl font-extrabold text-gray-900 mb-4">Your cart is empty</h2>
                <p className="text-lg text-gray-500 mb-8">Looks like you haven't added any books yet.</p>
                <Link href="/store" className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
                    Go to Store
                </Link>
            </div>
        );
    }

    return (
        <div className="bg-white">
            <div className="max-w-7xl mx-auto pt-16 pb-24 px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">Shopping Cart</h1>

                <div className="mt-12 lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start xl:gap-x-16">
                    <section aria-labelledby="cart-heading" className="lg:col-span-7">
                        <h2 id="cart-heading" className="sr-only">Items in your shopping cart</h2>

                        <ul role="list" className="border-t border-b border-gray-200 divide-y divide-gray-200">
                            {items.map((item) => (
                                <li key={item.$id} className="flex py-6 sm:py-10">
                                    <div className="flex-shrink-0">
                                        <div className="w-24 h-24 rounded-md overflow-hidden bg-gray-100 flex items-center justify-center text-gray-400">
                                            {item.image_url ? (
                                                <img src={item.image_url} alt={item.title} className="w-full h-full object-center object-cover" />
                                            ) : (
                                                <span>No Image</span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="ml-4 flex-1 flex flex-col justify-between sm:ml-6">
                                        <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
                                            <div>
                                                <div className="flex justify-between">
                                                    <h3 className="text-sm">
                                                        <Link href={`/store/${item.$id}`} className="font-medium text-gray-700 hover:text-gray-800">
                                                            {item.title}
                                                        </Link>
                                                    </h3>
                                                </div>
                                                <div className="mt-1 flex text-sm">
                                                    <p className="text-gray-500 capitalize">{item.type}</p>
                                                </div>
                                                <p className="mt-1 text-sm font-medium text-gray-900">₦{item.price.toLocaleString()}</p>
                                            </div>

                                            <div className="mt-4 sm:mt-0 sm:pr-9">
                                                <label htmlFor={`quantity-${item.$id}`} className="sr-only">Quantity, {item.title}</label>
                                                <select
                                                    id={`quantity-${item.$id}`}
                                                    name={`quantity-${item.$id}`}
                                                    value={item.quantity}
                                                    onChange={(e) => updateQuantity(item.$id, Number(e.target.value))}
                                                    className="max-w-full rounded-md border border-gray-300 py-1.5 text-base leading-5 font-medium text-gray-700 text-left shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                >
                                                    {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                                                        <option key={num} value={num}>{num}</option>
                                                    ))}
                                                </select>

                                                <div className="absolute top-0 right-0">
                                                    <button
                                                        type="button"
                                                        className="-m-2 p-2 inline-flex text-gray-400 hover:text-gray-500"
                                                        onClick={() => removeItem(item.$id)}
                                                    >
                                                        <span className="sr-only">Remove</span>
                                                        <Trash2 className="h-5 w-5" aria-hidden="true" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </section>

                    {/* Order summary */}
                    <section
                        aria-labelledby="summary-heading"
                        className="mt-16 bg-gray-50 rounded-lg px-4 py-6 sm:p-6 lg:p-8 lg:mt-0 lg:col-span-5"
                    >
                        <h2 id="summary-heading" className="text-lg font-medium text-gray-900">Order summary</h2>

                        <dl className="mt-6 space-y-4">
                            <div className="flex items-center justify-between">
                                <dt className="text-sm text-gray-600">Subtotal</dt>
                                <dd className="text-sm font-medium text-gray-900">₦{total().toLocaleString()}</dd>
                            </div>
                            <div className="border-t border-gray-200 pt-4 flex items-center justify-between">
                                <dt className="text-base font-medium text-gray-900">Order total</dt>
                                <dd className="text-base font-medium text-gray-900">₦{total().toLocaleString()}</dd>
                            </div>
                        </dl>

                        <div className="mt-6">
                            <Link
                                href="/checkout"
                                className="w-full bg-indigo-600 border border-transparent rounded-md shadow-sm py-3 px-4 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-indigo-500 block text-center"
                            >
                                Checkout
                            </Link>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
