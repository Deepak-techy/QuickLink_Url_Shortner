import Api from "./Api";
import type { UrlData, ApiResponse, CreateResponse } from "../types";

const generateShortCode = (): string => {
  const chars =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

const checkShortCodeExists = async (shortCode: string): Promise<boolean> => {
  try {
    const allUrls = await getAllUrls();
    return allUrls.some(
      (url) => url.short_code.toLowerCase() === shortCode.toLowerCase()
    );
  } catch {
    return false;
  }
};

export const createShortUrl = async (
  originalUrl: string,
  customCode?: string,
  password?: string,
  expiresInDays?: number
): Promise<{ shortCode: string; id: number }> => {
  let shortCode = "";

  if (customCode) {
    if (!/^[a-zA-Z0-9-_]+$/.test(customCode)) {
      throw new Error(
        "Custom code can only contain letters, numbers, hyphens, and underscores"
      );
    }

    if (customCode.length < 3 || customCode.length > 50) {
      throw new Error("Custom code must be between 3 and 50 characters");
    }

    const exists = await checkShortCodeExists(customCode);
    if (exists) {
      throw new Error(
        "This custom code is already taken. Please choose another one."
      );
    }

    shortCode = customCode;
  } else {
    let attempts = 0;
    const maxAttempts = 10;

    while (attempts < maxAttempts) {
      shortCode = generateShortCode();
      const exists = await checkShortCodeExists(shortCode);

      if (!exists) {
        break;
      }

      attempts++;
    }

    if (attempts >= maxAttempts) {
      throw new Error(
        "Unable to generate unique short code. Please try again."
      );
    }
  }

  const body: any = {
    original_url: originalUrl,
    short_code: shortCode,
    clicks: 0,
    is_custom: customCode ? 1 : 0,
    is_active: 1,
  };

  if (password) {
    body.password = password;
  }

  if (expiresInDays) {
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + expiresInDays);
    body.expires_at = expiryDate.toISOString().slice(0, 19).replace("T", " ");
  }

  const response = (await Api.post("/urls", {
    body,
  })) as ApiResponse<CreateResponse>;

  if (response.err) {
    throw new Error("Failed to create short URL");
  }

  return {
    shortCode,
    id: response.result?.lastInsertID || 0,
  };
};

export const getAllUrls = async (): Promise<UrlData[]> => {
  const response = (await Api.get("/urls", {
    sort: "-id",
  })) as ApiResponse<any[]>;

  if (response.err) {
    throw new Error("Failed to fetch URLs");
  }

  const urls = (response.result || []).map((url: any) => ({
    ...url,
    clicks: parseInt(String(url.clicks || 0), 10),
    is_custom: url.is_custom === 1 || url.is_custom === true,
    is_active: url.is_active === 1 || url.is_active === true,
  }));

  return urls;
};

export const getUrlByShortCode = async (
  shortCode: string
): Promise<UrlData | null> => {
  try {
    const allUrls = await getAllUrls();
    const matchedUrl = allUrls.find(
      (url) => url.short_code.toLowerCase() === shortCode.toLowerCase()
    );
    return matchedUrl || null;
  } catch (error) {
    console.error("Error fetching URL:", error);
    return null;
  }
};

export const getUrlById = async (id: number): Promise<UrlData | null> => {
  try {
    const response = (await Api.get(`/urls/${id}`)) as ApiResponse<any[]>;

    if (response.err || !response.result || response.result.length === 0) {
      return null;
    }

    const url = response.result[0];
    return {
      ...url,
      clicks: parseInt(String(url.clicks || 0), 10),
      is_custom: url.is_custom === 1 || url.is_custom === true,
      is_active: url.is_active === 1 || url.is_active === true,
    };
  } catch (error) {
    console.error("Error fetching URL by ID:", error);
    return null;
  }
};

export const incrementClicks = async (id: number): Promise<void> => {
  try {
    const urlData = await getUrlById(id);

    if (!urlData) {
      throw new Error("URL not found");
    }

    const updateResponse = (await Api.put(`/urls/${id}`, {
      body: {
        clicks: urlData.clicks + 1,
      },
    })) as ApiResponse<CreateResponse>;

    if (updateResponse.err) {
      throw new Error("Failed to update clicks");
    }
  } catch (error) {
    console.error("Error incrementing clicks:", error);
    throw error;
  }
};

export const toggleUrlStatus = async (
  id: number,
  isActive: boolean
): Promise<void> => {
  const response = (await Api.put(`/urls/${id}`, {
    body: {
      is_active: isActive ? 1 : 0,
    },
  })) as ApiResponse<CreateResponse>;

  if (response.err) {
    throw new Error("Failed to update URL status");
  }
};

export const deleteUrl = async (id: number): Promise<void> => {
  const response = (await Api.delete(`/urls/${id}`)) as ApiResponse<{
    lastDeletedID: number;
    affectedRows: number;
  }>;

  if (response.err) {
    throw new Error("Failed to delete URL");
  }
};
