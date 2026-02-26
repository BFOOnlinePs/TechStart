import { ContentGrid } from "@/components/News-blog/content-grid"
import { getPostsByType } from "@/app/actions/fetch-posts"
import { PostType, PostTypeValue } from "@/lib/schema/schema"
import { ContentItem, Tag } from "@/types/blog"
import { SeoMetadata } from "@/components/shared/SeoMetadata"
import { Metadata } from "next"

interface TestimonialsPageProps {
    params: {
        lang: string
    }
}

export async function generateMetadata({ params }: TestimonialsPageProps): Promise<Metadata> {
    const { lang } = params;

    return {
        title: lang === 'ar' ? 'الشهادات - تيك ستارت' : 'Testimonials - TechStart',
        description: lang === 'ar'
            ? 'اقرأ قصص النجاح والشهادات من شركائنا والمستفيدين من برامج تيك ستارت.'
            : 'Read success stories and testimonials from our partners and beneficiaries of TechStart programs.',
    }
}

export default async function TestimonialsPage({ params }: TestimonialsPageProps) {
    const {
        lang
    } = params;

    const { data: testimonials = [], error } = await getPostsByType(PostType.TESTIMONIALS)

    if (error) {
        return <div className="container mx-auto py-12 px-4">
            <SeoMetadata
                path="/media-center/news/testimonials"
                lang={lang}
                defaultTitle={lang === 'ar' ? 'الشهادات - تيك ستارت' : 'Testimonials - TechStart'}
                defaultDescription={lang === 'ar'
                    ? 'اقرأ قصص النجاح والشهادات من شركائنا والمستفيدين من برامج تيك ستارت.'
                    : 'Read success stories and testimonials from our partners and beneficiaries of TechStart programs.'
                }
            />
            <div className="text-center text-gray-600">
                {lang === 'ar'
                    ? 'عذراً، حدث خطأ أثناء تحميل الشهادات'
                    : 'Sorry, there was an error loading the testimonials'}
            </div>
        </div>
    }

    const title = lang === 'ar' ? 'الشهادات وقصص النجاح' : 'Testimonials & Success Stories'
    const subtitle = lang === 'ar'
        ? 'اقرأ ماذا يقول شركاؤنا ومستفيدونا عن تجاربهم معنا'
        : 'Read what our partners and beneficiaries say about their experience with us'

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const transformToContentItem = (post: any): ContentItem => ({
        id: post.id,
        type: post.type as PostTypeValue,
        title_en: post.title_en,
        title_ar: post.title_ar,
        description_en: post.description_en,
        description_ar: post.description_ar,
        imageUrl: post.imageUrl,
        pdfUrl: post.pdfUrl,
        readTime: post.readTime,
        createdAt: post.createdAt,
        slug: post.slug,
        isPdf: false,
        tags: post.tags.map((tag: Tag) => ({
            id: tag.id,
            name_en: tag.name_en,
            name_ar: tag.name_ar,
            slug: tag.slug
        }))
    });

    const transformedTestimonials = testimonials.map(transformToContentItem);

    return (
        <div className="bg-white dark:bg-gray-900">
            <SeoMetadata
                path="/media-center/news/testimonials"
                lang={lang}
                defaultTitle={lang === 'ar' ? 'الشهادات - تيك ستارت' : 'Testimonials - TechStart'}
                defaultDescription={lang === 'ar'
                    ? 'اقرأ قصص النجاح والشهادات من شركائنا والمستفيدين من برامج تيك ستارت.'
                    : 'Read success stories and testimonials from our partners and beneficiaries of TechStart programs.'
                }
            />
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
                <ContentGrid
                    title={title}
                    subtitle={subtitle}
                    items={transformedTestimonials}
                />
            </div>
        </div>
    );
}
