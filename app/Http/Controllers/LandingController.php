<?php

namespace App\Http\Controllers;

use App\Models\Package;
use App\Models\Post;
use App\Models\Registration;
use App\Models\Testimonial;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class LandingController extends Controller
{
    /**
     * Display the landing page with packages, testimonials, and blog posts.
     */
    public function index()
    {
        $packages = Package::where('is_active', true)->get();
        $testimonials = Testimonial::where('is_active', true)->get();
        
        // Latest 3 published blog posts
        $posts = Post::with('user')
            ->where('is_published', true)
            ->latest('published_at')
            ->take(3)
            ->get();

        return view('landing', compact('packages', 'testimonials', 'posts'));
    }

    /**
     * Handle the AJAX registration form submission.
     */
    public function registerLead(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'required|string|max:20',
            'address' => 'required|string|max:1000',
            'package_id' => 'nullable|exists:packages,id',
        ], [
            'name.required' => 'Nama lengkap wajib diisi.',
            'email.required' => 'Alamat email wajib diisi.',
            'email.email' => 'Format email tidak valid.',
            'phone.required' => 'Nomor WhatsApp / HP wajib diisi.',
            'address.required' => 'Alamat pemasangan lengkap wajib diisi.',
            'package_id.exists' => 'Paket yang Anda pilih tidak valid.',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        Registration::create([
            'name' => $request->name,
            'email' => $request->email,
            'phone' => $request->phone,
            'address' => $request->address,
            'package_id' => $request->package_id,
            'status' => 'pending',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Terima kasih! Pendaftaran Anda telah kami terima. Tim teknisi Bitfast akan segera menghubungi Anda untuk jadwal survei lokasi.'
        ]);
    }
}
