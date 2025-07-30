import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaRobot, FaHandPaper } from 'react-icons/fa';
export const CreateProject = ({ user }) => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        creationType: 'manual', // 'manual' | 'ai'
        domainType: 'situs', // 'situs' | 'custom'
        customDomain: '',
        theme: 'auto',
        language: 'ru'
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };
    const generateSlug = (name) => {
        return name
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-')
            .trim();
    };
    const handleSubmit = async () => {
        setIsLoading(true);
        setError('');
        try {
            const slug = generateSlug(formData.name);
            const situsSubdomain = `${slug}.situs.com`;
            const projectData = {
                name: formData.name,
                description: formData.description,
                slug,
                domain: formData.domainType === 'situs' ? situsSubdomain : undefined,
                customDomain: formData.domainType === 'custom' ? formData.customDomain : undefined,
                status: 'DRAFT',
                settings: {
                    theme: formData.theme,
                    language: formData.language,
                    creationType: formData.creationType
                }
            };
            const response = await fetch('/api/projects', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('auth-token')}`
                },
                body: JSON.stringify(projectData)
            });
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Ошибка создания проекта');
            }
            const project = await response.json();
            if (formData.creationType === 'ai') {
                // Перенаправляем на AI-генерацию
                navigate(`/projects/${project.id}/ai-setup`);
            }
            else {
                // Перенаправляем в dashboard
                navigate(`/projects/${project.id}/dashboard`);
            }
        }
        catch (err) {
            setError(err instanceof Error ? err.message : 'Ошибка создания проекта');
        }
        finally {
            setIsLoading(false);
        }
    };
    const renderStep1 = () => (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "text-center mb-8", children: [_jsx("h2", { className: "text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2", children: "\u041E\u0441\u043D\u043E\u0432\u043D\u0430\u044F \u0438\u043D\u0444\u043E\u0440\u043C\u0430\u0446\u0438\u044F" }), _jsx("p", { className: "text-gray-600 dark:text-gray-400", children: "\u0420\u0430\u0441\u0441\u043A\u0430\u0436\u0438\u0442\u0435 \u043E \u0432\u0430\u0448\u0435\u043C \u043F\u0440\u043E\u0435\u043A\u0442\u0435" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2", children: "\u041D\u0430\u0437\u0432\u0430\u043D\u0438\u0435 \u043F\u0440\u043E\u0435\u043A\u0442\u0430" }), _jsx("input", { type: "text", value: formData.name, onChange: (e) => handleInputChange('name', e.target.value), placeholder: "\u041C\u043E\u0439 \u0437\u0430\u043C\u0435\u0447\u0430\u0442\u0435\u043B\u044C\u043D\u044B\u0439 \u0441\u0430\u0439\u0442", className: "w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100", required: true })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2", children: "\u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435 (\u043D\u0435\u043E\u0431\u044F\u0437\u0430\u0442\u0435\u043B\u044C\u043D\u043E)" }), _jsx("textarea", { value: formData.description, onChange: (e) => handleInputChange('description', e.target.value), placeholder: "\u041A\u0440\u0430\u0442\u043A\u043E\u0435 \u043E\u043F\u0438\u0441\u0430\u043D\u0438\u0435 \u043F\u0440\u043E\u0435\u043A\u0442\u0430...", rows: 3, className: "w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100 resize-none" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4", children: "\u0421\u043F\u043E\u0441\u043E\u0431 \u0441\u043E\u0437\u0434\u0430\u043D\u0438\u044F" }), _jsxs("div", { className: "grid md:grid-cols-2 gap-4", children: [_jsxs("button", { type: "button", onClick: () => handleInputChange('creationType', 'manual'), className: `p-6 rounded-lg border-2 text-left transition-all ${formData.creationType === 'manual'
                                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                    : 'border-gray-200 dark:border-gray-600 hover:border-gray-300'}`, children: [_jsx(FaHandPaper, { className: `mb-3 ${formData.creationType === 'manual' ? 'text-blue-600' : 'text-gray-400'}`, size: 24 }), _jsx("h3", { className: "font-medium text-gray-900 dark:text-gray-100 mb-2", children: "\u0421\u043E\u0437\u0434\u0430\u0442\u044C \u0432\u0440\u0443\u0447\u043D\u0443\u044E" }), _jsx("p", { className: "text-sm text-gray-600 dark:text-gray-400", children: "\u041D\u0430\u0447\u0430\u0442\u044C \u0441 \u043F\u0443\u0441\u0442\u043E\u0439 \u0441\u0442\u0440\u0430\u043D\u0438\u0446\u044B \u0438 \u0441\u043E\u0437\u0434\u0430\u0442\u044C \u0441\u0430\u0439\u0442 \u0441\u0430\u043C\u043E\u0441\u0442\u043E\u044F\u0442\u0435\u043B\u044C\u043D\u043E" })] }), _jsxs("button", { type: "button", onClick: () => handleInputChange('creationType', 'ai'), className: `p-6 rounded-lg border-2 text-left transition-all ${formData.creationType === 'ai'
                                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                    : 'border-gray-200 dark:border-gray-600 hover:border-gray-300'}`, children: [_jsx(FaRobot, { className: `mb-3 ${formData.creationType === 'ai' ? 'text-blue-600' : 'text-gray-400'}`, size: 24 }), _jsx("h3", { className: "font-medium text-gray-900 dark:text-gray-100 mb-2", children: "\u0421\u043E\u0437\u0434\u0430\u0442\u044C \u0441 \u043F\u043E\u043C\u043E\u0449\u044C\u044E \u0418\u0418" }), _jsx("p", { className: "text-sm text-gray-600 dark:text-gray-400", children: "\u041F\u043E\u0437\u0432\u043E\u043B\u0438\u0442\u044C \u0418\u0418 \u0441\u043E\u0437\u0434\u0430\u0442\u044C \u0441\u0430\u0439\u0442 \u043D\u0430 \u043E\u0441\u043D\u043E\u0432\u0435 \u0432\u0430\u0448\u0438\u0445 \u0442\u0440\u0435\u0431\u043E\u0432\u0430\u043D\u0438\u0439" })] })] })] })] }));
    const renderStep2 = () => (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "text-center mb-8", children: [_jsx("h2", { className: "text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2", children: "\u041D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0430 \u0434\u043E\u043C\u0435\u043D\u0430" }), _jsx("p", { className: "text-gray-600 dark:text-gray-400", children: "\u0412\u044B\u0431\u0435\u0440\u0438\u0442\u0435 \u0430\u0434\u0440\u0435\u0441 \u0434\u043B\u044F \u0432\u0430\u0448\u0435\u0433\u043E \u0441\u0430\u0439\u0442\u0430" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4", children: "\u0422\u0438\u043F \u0434\u043E\u043C\u0435\u043D\u0430" }), _jsxs("div", { className: "space-y-4", children: [_jsx("button", { type: "button", onClick: () => handleInputChange('domainType', 'situs'), className: `w-full p-4 rounded-lg border-2 text-left transition-all ${formData.domainType === 'situs'
                                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                    : 'border-gray-200 dark:border-gray-600 hover:border-gray-300'}`, children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h3", { className: "font-medium text-gray-900 dark:text-gray-100 mb-1", children: "\u0411\u0435\u0441\u043F\u043B\u0430\u0442\u043D\u044B\u0439 \u043F\u043E\u0434\u0434\u043E\u043C\u0435\u043D Situs" }), _jsxs("p", { className: "text-sm text-gray-600 dark:text-gray-400", children: [generateSlug(formData.name) || 'your-site', ".situs.com"] })] }), _jsx("div", { className: "px-2 py-1 bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400 text-xs rounded", children: "\u0411\u0435\u0441\u043F\u043B\u0430\u0442\u043D\u043E" })] }) }), _jsx("button", { type: "button", onClick: () => handleInputChange('domainType', 'custom'), className: `w-full p-4 rounded-lg border-2 text-left transition-all ${formData.domainType === 'custom'
                                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                    : 'border-gray-200 dark:border-gray-600 hover:border-gray-300'}`, children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h3", { className: "font-medium text-gray-900 dark:text-gray-100 mb-1", children: "\u0421\u043E\u0431\u0441\u0442\u0432\u0435\u043D\u043D\u044B\u0439 \u0434\u043E\u043C\u0435\u043D" }), _jsx("p", { className: "text-sm text-gray-600 dark:text-gray-400", children: "\u041F\u043E\u0434\u043A\u043B\u044E\u0447\u0438\u0442\u044C \u0441\u0432\u043E\u0439 \u0434\u043E\u043C\u0435\u043D (example.com)" })] }), _jsx("div", { className: "px-2 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400 text-xs rounded", children: "\u041F\u0440\u0435\u043C\u0438\u0443\u043C" })] }) })] }), formData.domainType === 'custom' && (_jsxs("div", { className: "mt-4", children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2", children: "\u0412\u0430\u0448 \u0434\u043E\u043C\u0435\u043D" }), _jsx("input", { type: "text", value: formData.customDomain, onChange: (e) => handleInputChange('customDomain', e.target.value), placeholder: "example.com", className: "w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100" }), _jsx("p", { className: "text-xs text-gray-500 dark:text-gray-500 mt-1", children: "\u0423\u0431\u0435\u0434\u0438\u0442\u0435\u0441\u044C, \u0447\u0442\u043E \u0443 \u0432\u0430\u0441 \u0435\u0441\u0442\u044C \u043F\u0440\u0430\u0432\u0430 \u043D\u0430 \u0443\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u0438\u0435 DNS \u0437\u0430\u043F\u0438\u0441\u044F\u043C\u0438 \u044D\u0442\u043E\u0433\u043E \u0434\u043E\u043C\u0435\u043D\u0430" })] }))] })] }));
    const renderStep3 = () => (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "text-center mb-8", children: [_jsx("h2", { className: "text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2", children: "\u041D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438 \u043F\u0440\u043E\u0435\u043A\u0442\u0430" }), _jsx("p", { className: "text-gray-600 dark:text-gray-400", children: "\u041F\u043E\u0441\u043B\u0435\u0434\u043D\u0438\u0435 \u0448\u0442\u0440\u0438\u0445\u0438" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2", children: "\u0422\u0435\u043C\u0430 \u043E\u0444\u043E\u0440\u043C\u043B\u0435\u043D\u0438\u044F" }), _jsxs("select", { value: formData.theme, onChange: (e) => handleInputChange('theme', e.target.value), className: "w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100", children: [_jsx("option", { value: "auto", children: "\u0410\u0432\u0442\u043E\u043C\u0430\u0442\u0438\u0447\u0435\u0441\u043A\u0438 (\u043A\u0430\u043A \u0432 \u0431\u0440\u0430\u0443\u0437\u0435\u0440\u0435)" }), _jsx("option", { value: "light", children: "\u0421\u0432\u0435\u0442\u043B\u0430\u044F" }), _jsx("option", { value: "dark", children: "\u0422\u0435\u043C\u043D\u0430\u044F" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2", children: "\u042F\u0437\u044B\u043A \u0438\u043D\u0442\u0435\u0440\u0444\u0435\u0439\u0441\u0430" }), _jsxs("select", { value: formData.language, onChange: (e) => handleInputChange('language', e.target.value), className: "w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100", children: [_jsx("option", { value: "ru", children: "\u0420\u0443\u0441\u0441\u043A\u0438\u0439" }), _jsx("option", { value: "en", children: "English" })] })] }), _jsxs("div", { className: "bg-gray-50 dark:bg-gray-800 rounded-lg p-6", children: [_jsx("h3", { className: "font-medium text-gray-900 dark:text-gray-100 mb-4", children: "\u041F\u0440\u0435\u0432\u044C\u044E \u043D\u0430\u0441\u0442\u0440\u043E\u0435\u043A" }), _jsxs("div", { className: "space-y-2 text-sm", children: [_jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-gray-600 dark:text-gray-400", children: "\u041D\u0430\u0437\u0432\u0430\u043D\u0438\u0435:" }), _jsx("span", { className: "text-gray-900 dark:text-gray-100", children: formData.name || 'Не указано' })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-gray-600 dark:text-gray-400", children: "\u0414\u043E\u043C\u0435\u043D:" }), _jsx("span", { className: "text-gray-900 dark:text-gray-100", children: formData.domainType === 'situs'
                                            ? `${generateSlug(formData.name) || 'your-site'}.situs.com`
                                            : formData.customDomain || 'Не указан' })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-gray-600 dark:text-gray-400", children: "\u0421\u043E\u0437\u0434\u0430\u043D\u0438\u0435:" }), _jsx("span", { className: "text-gray-900 dark:text-gray-100", children: formData.creationType === 'ai' ? 'С помощью ИИ' : 'Вручную' })] })] })] })] }));
    return (_jsxs("div", { className: "min-h-screen bg-gray-50 dark:bg-gray-900", children: [_jsx("div", { className: "bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700", children: _jsx("div", { className: "max-w-2xl mx-auto px-4 sm:px-6 lg:px-8", children: _jsxs("div", { className: "flex items-center py-6", children: [_jsx("button", { onClick: () => navigate('/projects'), className: "mr-4 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors", children: _jsx(FaArrowLeft, { size: 20 }) }), _jsxs("div", { children: [_jsx("h1", { className: "text-xl font-bold text-gray-900 dark:text-gray-100", children: "\u0421\u043E\u0437\u0434\u0430\u043D\u0438\u0435 \u043D\u043E\u0432\u043E\u0433\u043E \u043F\u0440\u043E\u0435\u043A\u0442\u0430" }), _jsxs("p", { className: "text-gray-600 dark:text-gray-400 text-sm", children: ["\u0428\u0430\u0433 ", step, " \u0438\u0437 3"] })] })] }) }) }), _jsx("div", { className: "bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700", children: _jsx("div", { className: "max-w-2xl mx-auto px-4 sm:px-6 lg:px-8", children: _jsx("div", { className: "flex py-4", children: [1, 2, 3].map((stepNum) => (_jsxs("div", { className: "flex-1 flex items-center", children: [_jsx("div", { className: `w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${stepNum === step
                                        ? 'bg-blue-600 text-white'
                                        : stepNum < step
                                            ? 'bg-green-600 text-white'
                                            : 'bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-400'}`, children: stepNum < step ? '✓' : stepNum }), stepNum < 3 && (_jsx("div", { className: `flex-1 h-1 mx-4 ${stepNum < step ? 'bg-green-600' : 'bg-gray-200 dark:bg-gray-600'}` }))] }, stepNum))) }) }) }), _jsx("div", { className: "max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: _jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8", children: [step === 1 && renderStep1(), step === 2 && renderStep2(), step === 3 && renderStep3(), error && (_jsx("div", { className: "mt-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg", children: _jsx("p", { className: "text-red-600 dark:text-red-400 text-sm", children: error }) })), _jsxs("div", { className: "flex justify-between mt-8 pt-6 border-t border-gray-200 dark:border-gray-700", children: [_jsx("button", { onClick: () => setStep(Math.max(1, step - 1)), disabled: step === 1, className: "px-4 py-2 text-gray-600 dark:text-gray-400 disabled:opacity-50 disabled:cursor-not-allowed hover:text-gray-800 dark:hover:text-gray-200 transition-colors", children: "\u041D\u0430\u0437\u0430\u0434" }), step < 3 ? (_jsx("button", { onClick: () => setStep(step + 1), disabled: !formData.name || (step === 2 && formData.domainType === 'custom' && !formData.customDomain), className: "px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-colors", children: "\u0414\u0430\u043B\u0435\u0435" })) : (_jsx("button", { onClick: handleSubmit, disabled: isLoading || !formData.name, className: "px-6 py-2 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white rounded-lg transition-colors", children: isLoading ? 'Создание...' : 'Создать проект' }))] })] }) })] }));
};
export default CreateProject;
//# sourceMappingURL=CreateProject.js.map