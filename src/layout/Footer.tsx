import React from 'react';
import { Mail, MapPin, Phone, Instagram, Facebook, Twitter, Linkedin } from 'lucide-react';

import { useTranslation } from 'react-i18next';
import { MapFooter } from '../components/MapFooter';

export const Footer: React.FC = () => {
    const { t } = useTranslation();

    return (
        <footer className="bg-host-gradient text-blue-100/80 pt-16 pb-8 border-t border-white/10 relative overflow-hidden">
            {/* Subtle animated background effect */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-50%] right-[-10%] w-[600px] h-[600px] bg-cyan-600/10 rounded-full mix-blend-overlay filter blur-3xl animate-blob"></div>
            </div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-12">
                    {/* Brand Section */}
                    <div className="space-y-6">
                        <div className="flex items-center space-x-3">
                            <img src="https://atlantisswim.md/wp-content/uploads/2025/08/cropped-asat-03-scaled-1-e1755890850322.png" alt="Atlantis SwimSchool" className="h-10 w-10 object-contain" />
                            <span className="text-2xl font-extrabold text-white tracking-wider">
                                ATLANTIS <span className="text-host-cyan">SWIMSCHOOL</span>
                            </span>
                        </div>
                        <p className="text-blue-200/70 text-sm leading-relaxed max-w-xs">
                            {t('footer.brand_description')}
                        </p>
                        <div className="flex space-x-4 pt-2">
                            {[Facebook, Twitter, Instagram, Linkedin].map((Icon, idx) => (
                                <a key={idx} href="#" className="text-blue-300 hover:text-white hover:scale-110 transition-all duration-300">
                                    <Icon size={20} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-white font-bold text-lg mb-6 relative inline-block">
                            {t('footer.quick_links')}
                            <span className="absolute bottom-[-8px] left-0 w-12 h-1 bg-host-cyan rounded-full"></span>
                        </h4>
                        <ul className="space-y-3 text-sm">
                            {[
                                { key: 'courses', label: t('footer.links.courses') },
                                { key: 'coaches', label: t('footer.links.coaches') },
                                { key: 'students', label: t('footer.links.students') },
                                { key: 'schedule', label: t('footer.links.schedule') },
                                { key: 'admin', label: t('footer.links.admin') }
                            ].map((link) => (
                                <li key={link.key}>
                                    <a href="#" className="flex items-center hover:text-host-cyan transition-all duration-300 group">
                                        <span className="w-0 group-hover:w-2 h-0.5 bg-host-cyan mr-0 group-hover:mr-2 transition-all duration-300"></span>
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="text-white font-bold text-lg mb-6 relative inline-block">
                            {t('footer.contact_us')}
                            <span className="absolute bottom-[-8px] left-0 w-12 h-1 bg-host-cyan rounded-full"></span>
                        </h4>
                        <ul className="space-y-4 text-sm">
                            <li className="flex items-start">
                                <MapPin className="w-5 h-5 text-host-cyan mr-3 mt-0.5 flex-shrink-0" />
                                <span>{t('footer.address')}</span>
                            </li>
                            <li className="flex items-center">
                                <Mail className="w-5 h-5 text-host-cyan mr-3 flex-shrink-0" />
                                <a href="mailto:contact@swimschool.com" className="hover:text-white transition-colors">contact@swimschool.com</a>
                            </li>
                            <li className="flex items-center">
                                <Phone className="w-5 h-5 text-host-cyan mr-3 flex-shrink-0" />
                                <a href="tel:+40700123456" className="hover:text-white transition-colors">+40 700 123 456</a>
                            </li>
                        </ul>
                    </div>

                    {/* Map Section */}
                    <div className="w-full h-full min-h-[250px] lg:col-span-1">
                        <div className="lg:mt-0"> {/* Adjust spacing if needed */}
                            <MapFooter />
                        </div>
                    </div>
                </div>

                {/* Footer Bottom */}
                <div className="border-t border-white/10 pt-8 mt-8 flex flex-col md:flex-row justify-between items-center text-xs text-blue-300/50">
                    <p>{t('footer.rights_reserved', { year: new Date().getFullYear() })}</p>
                    <div className="flex space-x-6 mt-4 md:mt-0">
                        <a href="#" className="hover:text-white transition-colors">{t('footer.privacy_policy')}</a>
                        <a href="#" className="hover:text-white transition-colors">{t('footer.terms_of_service')}</a>
                        <a href="#" className="hover:text-white transition-colors">{t('footer.cookie_policy')}</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};
